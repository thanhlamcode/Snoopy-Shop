const systemAdmin = require("../../config/systems");
const Accounts = require("../../models/accounts.model");
const Roles = require("../../models/role.model");

module.exports.requireAuth = async (req, res, next) => {
  if (!req.cookies.token) {
    res.redirect(`${systemAdmin.prefitAdmin}/auth/login`);
    req.flash("error", `Vui lòng đăng nhập !`);
  } else {
    const user = await Accounts.findOne({ token: req.cookies.token }).select(
      "-password"
    );
    if (user) {
      const roles = await Roles.findOne({
        _id: user.role_id,
      }).select("title permissions");
      res.locals.user = user;
      res.locals.roles = roles;

      next();
    } else {
      res.redirect(`${systemAdmin.prefitAdmin}/auth/login`);
      req.flash("error", `Vui lòng đăng nhập !`);
    }
  }
};
