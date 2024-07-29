const express = require("express");
const router = express.Router();
const controller = require("../../controller/admin/my-account.controller");
const multer = require("multer");
const upload = multer();
const uploadCloud = require("../../middleware/admin/upload.middleware");

router.get("/", controller.index);
router.get("/edit", controller.edit);
router.patch(
  "/edit",
  upload.single("thumbnail"),
  uploadCloud.upload,
  controller.editPatch
);

module.exports = router;
