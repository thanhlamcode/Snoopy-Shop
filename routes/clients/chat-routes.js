const express = require("express");
const router = express.Router();
const controller = require("../../controller/clients/chat-controller");
const chatMiddleware = require("../../middleware/client/chat.middleware");
const multer = require("multer");
const upload = multer();
const uploadCloud = require("../../middleware/admin/upload.middleware");

router.get("/", controller.index);
router.get("/:roomChat", chatMiddleware.isAccess, controller.roomChat);
router.get(
  "/chatGroup/:id",
  chatMiddleware.isAccessGroup,
  controller.chatGroup
);
router.get(
  "/chatGroup/setting/:id",
  chatMiddleware.isAccessGroup,
  controller.chatSetting
);

module.exports = router;
