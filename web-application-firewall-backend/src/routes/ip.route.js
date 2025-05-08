const { Router } = require('express');
const { addIP, fetchIPList, updateIP, deleteIP } = require('../controllers/ip.controller');
const router = Router();

const authenticateJWT = require('../middlewares/authenticateJWT.middleware');

router.route("/add-ip").post(authenticateJWT, addIP)
router.route("/get-ip-list").get(authenticateJWT, fetchIPList)
router.route("/update-ip").post(authenticateJWT, updateIP)
router.route("/delete/:id").delete(authenticateJWT, deleteIP)

module.exports = router;