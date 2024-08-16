const express = require("express");
const router = express.Router();
const controller = require("../../controller/clients/user-controller");
const validate = require("../../validate/client/user.valide");
const userMiddle = require("../../middleware/client/require.middleware");

router.get("/login", controller.login);
router.get("/register", controller.register);
router.post("/register", validate.registerPost, controller.registerPost);
router.post("/login", validate.loginPost, controller.loginPost);
router.get("/logout", controller.logout);
router.get("/password/forgotPassword", controller.forgotPassword);
router.post(
  "/password/forgotPassword",
  validate.forgotPassword,
  controller.forgotPasswordPost
);
router.get("/password/otpPassword", controller.otpPassword);
router.post("/password/otp", controller.otpPost);
router.get("/password/reset", controller.resetPassword);
router.post(
  "/password/reset",
  validate.resetPasswordPost,
  controller.resetPasswordPost
);
router.get("/info", userMiddle.requireAuth, controller.userInfo);

module.exports = router;
