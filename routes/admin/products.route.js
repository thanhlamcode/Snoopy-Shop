const express = require("express");
const router = express.Router();
const controller = require("../../controller/admin/products.controller");
const multer = require("multer");
const storeMuler = require("../../helpers/storeMuler");
const validate = require("../../validate/admin/product.validate");
const upload = multer({ storage: storeMuler() });

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
  validate.createPost,
  controller.createPost
);

module.exports = router;
