const fs = require('fs').promises;
const path = require('path');

const checkMalicious = async (req) => {
  try {
    const dirPath = path.join(__dirname);
    const sqlData = await fs.readFile(`${dirPath}/../../public/temp/datasets/sql.txt`, 'utf8');
    const xssData = await fs.readFile(`${dirPath}/../../public/temp/datasets/xss.txt`, 'utf8');

    const sqlPatterns = sqlData
      .split('\n')
      .map(line => line.trim().toLowerCase())
      .filter(Boolean);

    const xssPatterns = xssData
      .split('\n')
      .map(line => line.trim().toLowerCase())
      .filter(Boolean);

    const checkData = (data, patterns) => {
      if (typeof data !== 'string') data = JSON.stringify(data);
      const lowerData = data.toLowerCase();
      for (const pattern of patterns) {
        if (lowerData.includes(pattern)) {
          return pattern;
        }
      }
      return null;
    };

    const checkObject = (source, sourceName) => {
      if (!source) return null;
      for (const key in source) {
        const value = source[key];

        const matchedXss = checkData(value, xssPatterns);
        if (matchedXss) {
          return { malicious: true, threatType: 'XSS', detected: matchedXss, location: `${sourceName}.${key}` };
        }

        const matchedSql = checkData(value, sqlPatterns);
        if (matchedSql) {
          return { malicious: true, threatType: 'SQL Injection', detected: matchedSql, location: `${sourceName}.${key}` };
        }
      }
      return null;
    };

    const bodyCheck = checkObject(req.body, 'body');
    if (bodyCheck) return bodyCheck;

    const paramCheck = checkObject(req.params, 'params');
    if (paramCheck) return paramCheck;

    const queryCheck = checkObject(req.query, 'query');
    if (queryCheck) return queryCheck;

    return { malicious: false };

  } catch (error) {
    console.error('Error reading dataset files:', error);
    return { malicious: false, error: true };
  }
};

module.exports = checkMalicious;
