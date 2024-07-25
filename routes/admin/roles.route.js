const express = require("express");
const router = express.Router();
const controller = require("../../controller/admin/roles.controller");

router.get("/", controller.index);
router.get("/create", controller.create);
router.post("/create", controller.createPost);
router.get("/edit/:id", controller.edit);
router.patch("/edit/:id", controller.editPatch);
router.delete("/delete/:id", controller.deleteItem);
router.get("/permission", controller.permission);
router.patch("/permissions", controller.permissionPatch);

module.exports = router;
