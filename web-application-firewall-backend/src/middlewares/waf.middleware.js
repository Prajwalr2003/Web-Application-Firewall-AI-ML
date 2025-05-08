const getClientIp = require("../utils/getClientIp");
const axios = require("axios");
const geoip = require('geoip-lite');
const Threat = require('../models/threat.model');
const User = require('../models/user.model');
const TrafficLogs = require("../models/trafficLogs.model");
const IP = require('../models/ip.model');
const mlModelUrl = process.env.ML_MODEL_URL || 'http://127.0.0.1:5001/predict'; // Using env variable

async function isMalicious(req) {
    const clientIp = getClientIp(req);
    let domain = "";
    if (req.hostname === "localhost") {
        const port = req.headers.host;
        domain = "127.0.0.1:" + port.split(":")[1];
    } else {
        domain = req.headers.host;
    }

    const user = await User.findOne({ domain: `http://${domain}` });
    const userId = user?._id || "";

    try {
        const existingIp = await IP.findOne({ address: clientIp });

        if (existingIp && existingIp.status) {
            console.log(`IP ${clientIp} is already blocked. Skipping ML check and logging.`);
            const trafficLogEntry = new TrafficLogs({
                ip: clientIp,
                hostname: req.hostname === '127.0.0.1' ? "localhost" : req.hostname,
                path: req.originalUrl,
                userAgent: req.headers['user-agent'] || '',
                dateTime: new Date(),
                requestMethod: req.method,
                country: geoip.lookup(clientIp)?.country || "UNKNOWN", // More generic default
                userId: userId, // Reusing the userId
                isBlocked: true,
            });
            try {
                await trafficLogEntry.save();
            } catch (error) {
                console.error("COULDN'T SAVE TRAFFIC LOG FOR BLOCKED IP", error);
            }
            return true;
        }

        const fullUrl = `http://${req.headers.host}${req.originalUrl}`;
        let mlResponse;
        try {
            mlResponse = await axios.post(mlModelUrl, { url: fullUrl });
        } catch (error) {
            console.error("Error communicating with ML model:", error.message);
            // Handle the case where the ML model is unavailable
            // You might want to log this and decide whether to block or allow the request
            return false; // Or potentially true, depending on your security stance
        }

        const { is_malicious, attack_type, confidence } = mlResponse.data;
        console.log(mlResponse.data);
        const country = geoip.lookup(clientIp)?.country || "UNKNOWN";

        let severity = "LOW";
        if (confidence >= 0.6 && confidence < 0.8) {
            severity = "MEDIUM";
        } else if (confidence >= 0.8) {
            severity = "HIGH";
        }

        const trafficLogEntry = new TrafficLogs({
            ip: clientIp,
            hostname: req.hostname === '127.0.0.1' ? "localhost" : req.hostname,
            path: req.originalUrl,
            userAgent: req.headers['user-agent'] || '',
            dateTime: new Date(),
            requestMethod: req.method,
            country: country,
            userId: userId,
            isBlocked: is_malicious
        });

        try {
            await trafficLogEntry.save();
        } catch (error) {
            console.error("COULDN'T SAVE TRAFFIC LOG", error);
        }

        if (is_malicious) {
            try {
                const threatEntry = new Threat({
                    userId: userId,
                    ip: clientIp,
                    hostname: req.hostname === '127.0.0.1' ? "localhost" : req.hostname,
                    requestPath: req.originalUrl,
                    requestMethod: req.method,
                    threatType: attack_type,
                    geoLocation: country,
                    status: "blocked",
                    severity: severity,
                    requestBody: req.body,
                    requestQuery: req.query,
                    requestParams: req.params
                });

                try {
                    await threatEntry.save();
                    // Check if the IP already exists
                    if (existingIp) {
                        // If it exists, just ensure its status is true and update description
                        if (!existingIp.status) {
                            existingIp.status = true;
                            existingIp.description = attack_type || "Malicious activity detected";
                            await existingIp.save();
                            console.log(`Existing IP ${clientIp} marked as blocked.`);
                        }
                    } else {
                        // If it doesn't exist, create a new blocked IP entry
                        const newBlockedIp = new IP({
                            ipType: "network",
                            address: clientIp,
                            name: req.hostname === '127.0.0.1' ? "localhost" : req.hostname,
                            description: attack_type || "Malicious activity detected",
                            status: true,
                            userId: userId
                        });
                        await newBlockedIp.save();
                        console.log(`New IP ${clientIp} added to blocked list.`);
                    }
                } catch (error) {
                    console.error("Error while saving threat entry or blocking IP", error);
                }
            } catch (error) {
                console.error("Error while creating Threat entry", error);
            }
            return true;
        }

    } catch (error) {
        console.error("Error in isMalicious:", error);
    }

    return false;
}

module.exports = isMalicious;