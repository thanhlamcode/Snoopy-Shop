const express = require("express");
const router = express.Router();
const controller = require("../../controller/admin/roles.controller");

router.get("/", controller.index);
router.get("/create", controller.create);
router.post("/create", controller.createPost);

module.exports = router;
