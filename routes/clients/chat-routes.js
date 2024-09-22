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
router.post(
  "/chatGroup/addMember/:roomChatId",
  chatMiddleware.isAdminAccess,
  controller.chatSettingAddMember
);
router.post(
  "/chatGroup/setting/:roomChatId",
  upload.single("thumbnail"),
  uploadCloud.upload,
  chatMiddleware.isAdminAccess,
  controller.updateInfoChat
);

module.exports = router;
