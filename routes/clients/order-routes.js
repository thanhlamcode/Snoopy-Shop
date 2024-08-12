const express = require("express");
const router = express.Router();
const controller = require("../../controller/clients/order-controller");

router.post("/", controller.index);
router.get("/checkout", controller.checkOut);
router.post("/payment", controller.payment);

module.exports = router;
