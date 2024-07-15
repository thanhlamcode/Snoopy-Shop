const express = require("express");
const router = express.Router();
const controller = require("../../controller/admin/products-category.controller");
// const validate = require("../../validate/admin/product-category.validate");
const multer = require("multer");
const upload = multer();
const uploadCloud = require("../../middleware/admin/upload.middleware");

router.get("/", controller.index);
router.get("/create", controller.create);
router.post(
  "/create",
  upload.single("thumbnail"),
  uploadCloud.upload,
  //   validate.createPost,
  controller.createPost
);

module.exports = router;
