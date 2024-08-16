const express = require("express");
const router = express.Router();
const controller = require("../../controller/admin/user.controller");
const multer = require("multer");
const upload = multer();
const uploadCloud = require("../../middleware/admin/upload.middleware");

router.get("/", controller.index);
router.patch("/change-status/:status/:id", controller.changeStatus);

module.exports = router;
