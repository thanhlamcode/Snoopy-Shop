const express = require("express");
const router = express.Router();
const controller = require("../../controller/clients/order-controller");

router.post("/", controller.index);
router.get("/checkout", controller.checkOut);
router.post("/payment", controller.payment);
router.get("/success/:id", controller.success);

module.exports = router;
