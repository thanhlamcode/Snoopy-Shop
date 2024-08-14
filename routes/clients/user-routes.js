const express = require("express");
const router = express.Router();
const controller = require("../../controller/clients/user-controller");

router.get("/login", controller.login);
router.get("/register", controller.register);
router.post("/register", controller.registerPost);

module.exports = router;
