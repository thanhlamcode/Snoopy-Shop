const express = require("express");
const router = express.Router();
const controller = require("../../controller/clients/user-controller");
const validate = require("../../validate/client/user.valide");

router.get("/login", controller.login);
router.get("/register", controller.register);
router.post("/register", validate.registerPost, controller.registerPost);
router.post("/login", validate.loginPost, controller.loginPost);
router.get("/logout", controller.logout);

module.exports = router;
