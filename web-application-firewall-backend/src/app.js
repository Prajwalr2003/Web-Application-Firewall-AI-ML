const express = require("express");
const cookieParse = require("cookie-parser");
const cors = require("cors");
const app = express();
const { createProxyMiddleware } = require('http-proxy-middleware');
const checkMalicious = require("./middlewares/checkMalicious.middleware");
const axios = require('axios');
const User = require("./models/user.model");
const TrafficLogs = require("./models/trafficLogs.model");
const isMalicious = require("./middlewares/waf.middleware");
const getClientIp = require("./utils/getClientIp");
const Threat = require("./models/threat.model");
const IP = require("./models/ip.model");
const geoip = require('geoip-lite');

// const TARGET_SERVER = "http://127.0.0.1:3000";
const allowedOrigins = [
  "http://localhost:5173",
  // "http://localhost:4000", 
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));
app.use(express.static("public"));
app.use(cookieParse());

app.use(async (req, res, next) => {
  try {
      if (req.path.startsWith('/waf/api/')) {
          return next();
      }

      const response = await checkMalicious(req);
      const { malicious, threatType } = response; // Destructure the response
      if (!malicious) {
          return next();
      }

      const clientIp = getClientIp(req);
      const country = geoip.lookup(clientIp)?.country || "INDIA";
      const user = await User.findOne({ domain: `http://${req.headers.host}` });
      const userId = user?._id || "";

      const existingIp = await IP.findOne({ address: clientIp });

      if (existingIp && existingIp.status === true) {
          console.log(`IP ${clientIp} is already blocked.`);
          return res.status(403).json({
              status: 'error',
              message: 'Request blocked: IP is on the blacklist',
              details: 'This IP address has been identified as malicious and is blocked.',
              code: 'IP-BLACKLISTED'
          });
      }

      try {
          const trafficLogEntry = new TrafficLogs({
              ip: clientIp,
              hostname: req.hostname === '127.0.0.1' ? "localhost" : req.hostname,
              path: req.originalUrl,
              userAgent: req.headers['user-agent'] || '',
              dateTime: new Date(),
              requestMethod: req.method,
              country: country,
              userId: userId,
              isBlocked: malicious, // Use the malicious flag from checkMalicious
          });
          await trafficLogEntry.save();
      } catch (error) {
          console.error("error while storing traffic logs in local malicious code checking", error);
      }

      if (malicious) {
          try {
              const threatEntry = new Threat({
                  userId: userId,
                  ip: clientIp,
                  hostname: req.hostname === '127.0.0.1' ? "localhost" : req.hostname,
                  requestPath: req.originalUrl,
                  requestMethod: req.method,
                  threatType: threatType,
                  geoLocation: country,
                  status: "blocked",
                  severity: threatType === "SQL Injection" ? "MEDIUM" : "LOW",
                  requestBody: req.body,
                  requestQuery: req.query,
                  requestParams: req.params
              });
              await threatEntry.save();

              // Check if the IP already exists
              if (existingIp) {
                  // If it exists, just update its status to blocked
                  existingIp.status = true;
                  existingIp.description = threatType || "Malicious activity detected";
                  await existingIp.save();
                  console.log(`Existing IP ${clientIp} marked as blocked.`);
              } else {
                  // If it doesn't exist, create a new blocked IP entry
                  const newBlockedIp = new IP({
                      ipType: "network",
                      address: clientIp,
                      name: req.hostname === '127.0.0.1' ? "localhost" : req.hostname,
                      description: threatType || "Malicious activity detected",
                      status: true,
                      userId: userId
                  });
                  await newBlockedIp.save();
                  console.log(`New IP ${clientIp} added to blocked list.`);
              }

              return res.status(403).json({
                  status: 'error',
                  message: 'Request blocked: Malicious activity detected by local check',
                  details: 'The request has been blocked by local malicious request checking.',
                  code: 'LOCAL-MALICIOUS'
              });
          } catch (error) {
              console.error("Error while saving threat entry or blocking IP", error);
              return res.status(500).json({ // Send 500 if there's an error saving the threat
                  status: 'error',
                  message: 'Internal server error: Error logging threat or blocking IP',
                  details: error.message,
                  code: 'THREAT-BLOCK-ERROR'
              });
          }
      } else {
          //  Not malicious, proceed to the next middleware/route
          next();
      }
  } catch (error) {
      console.error('Error in local malicious check middleware:', error);
      return res.status(500).json({
          status: 'error',
          message: 'Internal server error: Failed to check for local malicious activity',
          details: error.message,
          code: 'LOCAL-CHECK-ERROR'
      });
  }
});

app.use(async (req, res, next) => {
  try {
    if (req.path.startsWith('/waf/api/')) {
      return next();
    }
    const isMaliciousResponse = await isMalicious(req); 

    if (isMaliciousResponse) {
      return res.status(403).json({
        status: 'error',
        message: 'Request blocked: Malicious activity detected',
        details: isMaliciousResponse.details || 'The request has been blocked by the Web Application Firewall.', 
        code: 'WAF-MALICIOUS',
      });
    } else {
      next(); 
    }
  } catch (error) {
    console.error('Error checking URL with model:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error: Failed to check URL',
      details: error.message, 
      code: 'WAF-ERROR',
    });
  }
});

const userRouter = require('./routes/user.route');
app.use("/waf/api/v1/user", userRouter);

const ipRouter = require('./routes/ip.route');
app.use("/waf/api/v1/ip", ipRouter);

const trafficRouter = require("./routes/traffic.route");
app.use("/waf/api/v1/traffic-logs", trafficRouter);

const threatRouter = require("./routes/threat.route");
app.use("/waf/api/v1/threats", threatRouter);

module.exports = app;
