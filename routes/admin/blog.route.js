const express = require("express");
const router = express.Router();
const controller = require("../../controller/admin/blog.controller");
const multer = require("multer");
const upload = multer();
const uploadCloud = require("../../middleware/admin/upload.middleware");

router.get("/", controller.index);
router.get("/create", controller.create);
router.post(
  "/create",
  upload.single("thumbnail"),
  uploadCloud.upload,
  controller.createPost
);
router.patch("/change-status/:status/:id", controller.changeStatus);

module.exports = router;
