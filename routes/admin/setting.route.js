const express = require("express");
const router = express.Router();
const controller = require("../../controller/admin/setting.controller");
const multer = require("multer");
const upload = multer();
const uploadCloud = require("../../middleware/admin/upload.middleware");

router.get("/general", controller.general);
router.patch(
  "/general",
  upload.single("logo"),
  uploadCloud.upload,
  controller.generalPost
);

module.exports = router;
