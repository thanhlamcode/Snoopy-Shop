const express = require("express");
const router = express.Router();
const controller = require("../../controller/clients/chat-controller");

router.get("/", controller.index);
router.get("/:roomChat", controller.roomChat);

module.exports = router;
