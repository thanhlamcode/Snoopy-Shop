const User = require("../../models/users.model");
const ForgotPassword = require("../../models/forgot-password.model");
const Cart = require("../../models/cart.model");
const generateHelper = require("../../helpers/generate");
const sendMailHelper = require("../../helpers/sendMail");
const htmlHelper = require("../../helpers/html");
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

    const existCart = await Cart.findOne({
      user_id: existingUser.id,
    });

    if (existCart) {
      res.cookie("cartId", existCart.id);
    } else {
      const cartId = req.cookies.cartId;

      await Cart.updateOne(
        { _id: cartId },
        {
          user_id: existingUser.id,
        }
      );
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
  res.clearCookie("cartId");
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
    req.flash("success", "MÃ OTP ĐÃ ĐƯỢC GỬI");
    res.redirect(`/user/password/otpPassword?email=${email}`);
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

  // Nếu tồn tại email thì gửi mã otp
  const subject = "MÃ OTP XÁC MINH LẤY LẠI MẬT KHẨU";
  const html = htmlHelper.html(otp);
  // console.log(html);

  sendMailHelper.sendMail(email, subject, html);

  res.redirect(`/user/password/otpPassword?email=${email}`);
};

// [GET] /user/password/otpPassword
module.exports.otpPassword = async (req, res) => {
  const email = req.query.email;

  res.render("client/pages/user/otpPassword", {
    pageTitle: "Xác thực OTP",
    email: email,
  });
};

// [POST] /user/password/otp
module.exports.otpPost = async (req, res) => {
  const otp = req.body.otp;
  const email = req.body.email;

  const checkOTP = await ForgotPassword.findOne({
    otp: otp,
    email: email,
  });

  if (!checkOTP) {
    req.flash("error", "Mã OTP sai!");
    res.redirect("back");
    return;
  }

  const user = await User.findOne({
    email: email,
  });

  res.cookie("tokenUser", user.tokenUser);
  res.redirect("/user/password/reset");
};

// [GET] /user/password/reset
module.exports.resetPassword = async (req, res) => {
  res.render("client/pages/user/resetPassword", {
    pageTitle: "Đổi mật khẩu",
  });
};

// [POST] /user/password/reset
module.exports.resetPasswordPost = async (req, res) => {
  const password = req.body.password;

  const tokenUser = req.cookies.tokenUser;

  await User.updateOne(
    {
      tokenUser: tokenUser,
    },
    {
      password: md5(password),
    }
  );

  req.flash("success", "Đổi mật khẩu thành công");
  res.redirect(`/`);
};

// [GET] /user/info
module.exports.userInfo = async (req, res) => {
  res.render("client/pages/user/info", {
    pageTitle: "Thông tin cá nhân",
  });
};

// [GET] /user/info/edit
module.exports.userInfoEdit = async (req, res) => {
  const user = await User.findOne({
    tokenUser: req.cookies.tokenUser,
  });

  res.render("client/pages/user/infoEdit", {
    pageTitle: "Chỉnh sửa thông tin cá nhân",
    user: user,
  });
};

// [POST] /user/info/edit
module.exports.userInfoEditPost = async (req, res) => {
  console.log(req.body);

  const tokenUser = req.cookies.tokenUser;

  if (req.body.password) {
    const password = md5(req.body.password);

    req.body.password = password;

    await User.updateOne({ tokenUser: tokenUser }, req.body);
  } else {
    await User.updateOne(
      { tokenUser: tokenUser },
      {
        email: req.body.email,
        fullName: req.body.fullName,
      }
    );
  }

  req.flash("success", "Cập nhập thông tin tài khoản thành công");
  res.redirect(`/user/info`);
};
