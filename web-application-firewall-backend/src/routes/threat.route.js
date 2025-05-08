const { Router } = require('express');
const router = Router();
const authenticateJWT = require('../middlewares/authenticateJWT.middleware');
const { fetchThreats } = require('../controllers/threat.controller');

router.route("/fetch").get(authenticateJWT, fetchThreats);

module.exports = router;