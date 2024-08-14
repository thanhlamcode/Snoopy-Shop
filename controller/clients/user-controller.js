const User = require("../../models/users.model");
const md5 = require("md5");
const BlogCategory = require("../../models/blog-category.model");
const productCategoryHelper = require("../../helpers/products-category");

// [GET] /user/login
module.exports.login = async (req, res) => {
  res.render("client/pages/user/login", {
    pageTitle: "Trang đăng nhập",
  });
};

// [POST] /user/register
module.exports.register = async (req, res) => {
  res.render("client/pages/user/register", {
    pageTitle: "Trang đăng ký",
  });
};

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

  req.flash("success", `Đăng ký tài khoản thành công!!`);
  res.redirect(`/user/login`);
};
