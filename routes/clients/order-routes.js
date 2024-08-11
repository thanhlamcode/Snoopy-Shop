const express = require("express");
const router = express.Router();
const controller = require("../../controller/clients/order-controller");

router.post("/", controller.index);

module.exports = router;
