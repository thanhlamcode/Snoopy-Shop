const express = require("express");
const router = express.Router();
const controller = require("../../controller/clients/chat-controller");
const chatMiddleware = require("../../middleware/client/chat.middleware");

router.get("/", controller.index);
router.get("/:roomChat", chatMiddleware.isAccess, controller.roomChat);
router.get("/chatGroup/:id", controller.chatGroup);

module.exports = router;
