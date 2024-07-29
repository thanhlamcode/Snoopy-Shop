const express = require("express");
const router = express.Router();
const controller = require("../../controller/admin/products.controller");
const validate = require("../../validate/admin/product.validate");
const multer = require("multer");
const upload = multer();
const uploadCloud = require("../../middleware/admin/upload.middleware");

router.get("/", controller.products);
router.get("/restore", controller.restore);
router.patch("/restore/:id", controller.restoreProducts);
router.patch("/restore-multi", controller.restoreMulti);
router.patch("/change-status/:status/:id", controller.changeStatus);
router.patch("/change-multi", controller.changeMulti);
router.delete("/delete/:id", controller.deleteItem);
router.get("/create", controller.create);
router.post(
  "/create",
  upload.single("thumbnail"),
  uploadCloud.upload,
  validate.createPost,
  controller.createPost
);
router.get("/edit/:id", controller.edit);
router.patch(
  "/edit/:id",
  upload.single("thumbnail"),
  uploadCloud.upload,
  validate.createPost,
  controller.editPatch
);
router.get("/detail/:id", controller.detail);
router.get("/historyEdit/:id", controller.historyEdit);

module.exports = router;
