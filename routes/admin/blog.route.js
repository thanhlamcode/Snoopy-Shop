const express = require("express");
const router = express.Router();
const controller = require("../../controller/admin/blog.controller");
const multer = require("multer");
const upload = multer();
const uploadCloud = require("../../middleware/admin/upload.middleware");

router.get("/", controller.index);
router.get("/create", controller.create);
router.get("/edit/:id", controller.edit);
router.post(
  "/create",
  upload.single("thumbnail"),
  uploadCloud.upload,
  controller.createPost
);
router.patch("/change-status/:status/:id", controller.changeStatus);
router.patch("/change-multi", controller.changeMulti);
router.patch(
  "/edit/:id",
  upload.single("thumbnail"),
  uploadCloud.upload,
  controller.editPatch
);
router.get("/detail/:id", controller.detail);
router.delete("/delete/:id", controller.deleteItem);
router.get("/restore", controller.restore);
router.patch("/restore/:id", controller.restoreBlog);
router.patch("/restore-multi", controller.restoreMulti);
router.get("/historyEdit/:id", controller.historyEdit);

module.exports = router;
