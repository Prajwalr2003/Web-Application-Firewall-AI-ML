const { Router } = require('express');
const router = Router();
const authenticateJWT = require('../middlewares/authenticateJWT.middleware');
const { fetchTrafficLogs } = require('../controllers/traffic.controller');

router.route("/fetch").get(authenticateJWT, fetchTrafficLogs);

module.exports = router;