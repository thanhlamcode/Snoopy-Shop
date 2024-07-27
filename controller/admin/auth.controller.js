const Accounts = require("../../models/accounts.model");
const md5 = require("md5");
const systemAdmin = require("../../config/systems");

// [GET] /admin/auth/login
module.exports.login = (req, res) => {
  if (req.cookies.token) {
    res.redirect(`${systemAdmin.prefitAdmin}/dashboard`);
  } else {
    res.render("admin/pages/auth/login", {
      pageTitle: "Trang đăng nhập",
    });
  }
};

// [POST] /admin/auth/login
module.exports.loginPost = async (req, res) => {
  console.log(req.body);
  const email = req.body.email;
  const password = req.body.password;

  const user = await Accounts.findOne({
    email: email,
  });

  if (!user) {
    req.flash("error", `Email ${req.body.email} không tồn tại`);
    res.redirect(`back`);
    return;
  }
  if (md5(password) != user.password) {
    req.flash("error", `Sai mật khẩu !`);
    res.redirect(`back`);
    return;
  }
  if (user.status != "active") {
    req.flash("error", `Tài khoản đã bị khóa !`);
    res.redirect(`back`);
    return;
  }

  res.cookie("token", user.token);
  req.flash("success", `Đăng nhập thành công !`);
  res.redirect(`${systemAdmin.prefitAdmin}/dashboard`);
};

// [GET] /admin/auth/logout
module.exports.logout = (req, res) => {
  res.clearCookie("token");
  req.flash("success", `Đăng xuất thành công !`);
  res.redirect(`${systemAdmin.prefitAdmin}/auth/login`);
};
