const express = require("express");
const router = express.Router();
const controller = require("../../controller/admin/products.controller");

router.get("/", controller.products);
router.get("/restore", controller.restore);
router.patch("/restore/:id", controller.restoreProducts);
router.patch("/restore-multi", controller.restoreMulti);
router.patch("/change-status/:status/:id", controller.changeStatus);
router.patch("/change-multi", controller.changeMulti);
router.delete("/delete/:id", controller.deleteItem);

module.exports = router;
