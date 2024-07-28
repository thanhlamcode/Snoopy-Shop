const express = require("express");
const router = express.Router();
const controller = require("../../controller/admin/accounts.controller");
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
router.get("/edit/:id", controller.edit);
router.patch(
  "/edit/:id",
  upload.single("thumbnail"),
  uploadCloud.upload,
  controller.editPatch
);
router.delete("/delete/:id", controller.deleteItem);

module.exports = router;
