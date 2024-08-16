const User = require("../../models/users.model");

module.exports.requireAuth = async (req, res, next) => {
  if (!req.cookies.tokenUser) {
    req.flash("error", `Vui lòng đăng nhập !`);
    res.redirect(`/user/login`);
  } else {
    const user = await User.findOne({
      tokenUser: req.cookies.tokenUser,
    }).select("-password");
    if (user) {
      res.locals.user = user;

      next();
    } else {
      req.flash("error", `Vui lòng đăng nhập !`);
      res.redirect(`/user/login`);
    }
  }
};
