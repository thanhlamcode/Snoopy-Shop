const User = require("../../models/users.model");
const ForgotPassword = require("../../models/forgot-password.model");
const generateHelper = require("../../helpers/generate");
const md5 = require("md5");

// [GET] /user/login
module.exports.login = async (req, res) => {
  res.render("client/pages/user/login", {
    pageTitle: "Trang đăng nhập",
  });
};

// [GET] /user/register
module.exports.register = async (req, res) => {
  res.render("client/pages/user/register", {
    pageTitle: "Trang đăng ký",
  });
};

// [POST] /user/register
module.exports.registerPost = async (req, res) => {
  console.log(req.body);

  // Tìm kiếm email trong cơ sở dữ liệu
  const existingUser = await User.findOne({ email: req.body.email });

  if (existingUser) {
    req.flash("error", "Email đã được sử dụng!");
    return res.redirect("/user/register");
  }

  req.body.password = md5(req.body.password);

  const user = new User(req.body);
  await user.save();

  res.cookie("tokenUser", user.tokenUser);

  req.flash("success", `Đăng ký tài khoản thành công!!`);
  res.redirect(`/`);
};

// [POST] /user/login
module.exports.loginPost = async (req, res) => {
  console.log(req.body);

  req.body.password = md5(req.body.password);

  const existingUser = await User.findOne({
    email: req.body.email,
    password: req.body.password,
    deleted: false,
  });

  if (existingUser) {
    if (existingUser.status == "inactive") {
      req.flash("error", "Tài khoản đã bị khóa!");
      res.redirect("back");
      return;
    }

    req.flash("success", "Đăng nhập thành công!");
    res.cookie("tokenUser", existingUser.tokenUser);
    return res.redirect("/");
  } else {
    req.flash("error", "Đăng nhập thất bại!");
    return res.redirect("back");
  }
};

// [GET] /user/logout
module.exports.logout = async (req, res) => {
  res.clearCookie("tokenUser");
  req.flash("success", "Đăng xuất thành công!");
  res.redirect("/");
};

// [GET] /user/password/forgotPassword
module.exports.forgotPassword = async (req, res) => {
  res.render("client/pages/user/forgotPassword", {
    pageTitle: "Lấy lại mật khẩu",
  });
};

// [POST] /user/password/forgotPassword
module.exports.forgotPasswordPost = async (req, res) => {
  const email = req.body.email;
  console.log(email);

  const user = await User.findOne({
    email: email,
    deleted: false,
  });

  if (!user) {
    req.flash("error", "Email không tồn tại!");
    res.redirect("back");
    return;
  }

  const checkOtpExist = await ForgotPassword.findOne({
    email: email,
  });

  if (checkOtpExist) {
    req.flash("error", "MÃ OTP ĐÃ ĐƯỢC GỬI! VUI LÒNG THỬ LẠI SAU 3 PHÚT!");
    res.redirect("back");
    return;
  }

  // Lưu tạm thời vào bảng ForgotPassword

  const otp = generateHelper.generateRandomNumber(8);

  const record = new ForgotPassword({
    email: email,
    otp: otp,
    expireAt: Date.now(),
  });
  record.save();

  res.send("ok");
};
