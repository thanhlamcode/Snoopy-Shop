const express = require("express");
const router = express.Router();
const controller = require("../../controller/admin/user.controller");
const multer = require("multer");
const upload = multer();
const uploadCloud = require("../../middleware/admin/upload.middleware");

router.get("/", controller.index);
router.patch("/change-status/:status/:id", controller.changeStatus);
router.patch("/change-multi", controller.changeMulti);
router.delete("/delete/:id", controller.deleteItem);
router.get("/order", controller.order);
router.patch("/order/change-status/:status/:id", controller.changeStatusOrder);
router.get("/order/detail/:id", controller.detail);

module.exports = router;
