const systemAdmin = require("../../config/systems");
const Accounts = require("../../models/accounts.model");

module.exports.requireAuth = async (req, res, next) => {
  if (!req.cookies.token) {
    res.redirect(`${systemAdmin.prefitAdmin}/auth/login`);
    req.flash("error", `Vui lòng đăng nhập !`);
  } else {
    const user = await Accounts.findOne({ token: req.cookies.token });
    if (user) {
      next();
    } else {
      res.redirect(`${systemAdmin.prefitAdmin}/auth/login`);
      req.flash("error", `Vui lòng đăng nhập !`);
    }
  }
};
