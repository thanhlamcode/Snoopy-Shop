const express = require("express");
const router = express.Router();
const controller = require("../../controller/clients/users-controller");
const multer = require("multer");
const upload = multer();
const uploadCloud = require("../../middleware/admin/upload.middleware");
const adminMiddleware = require("../../middleware/client/chat.middleware");

router.get("/not-friend", controller.notFriend);
router.get("/request", controller.request);
router.get("/accept", controller.accept);
router.get("/friends", controller.listFriend);
router.get("/room-chat", controller.roomChat);
router.get("/create-room-chat", controller.createRoomChat);
router.post(
  "/create-room-chat",
  upload.single("thumbnail"),
  uploadCloud.upload,
  controller.postCreateRoomChat
);
router.get(
  "/addFriend/:id",
  adminMiddleware.isAdminAccess,
  controller.addFriend
);
router.get(
  "/admin/:roomChatId/:userId",
  adminMiddleware.isAdminAccess,
  controller.addAdmin
);
router.get(
  "/deleteMember/:roomChatId/:userId",
  adminMiddleware.isAdminAccess,
  controller.deleteMember
);

module.exports = router;
