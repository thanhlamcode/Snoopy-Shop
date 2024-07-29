const systemAdmin = require("../../config/systems");
const Accounts = require("../../models/accounts.model");
const md5 = require("md5");

// [GET] /admin/my-account
module.exports.index = async (req, res) => {
  res.render("admin/pages/my-account/index", {
    pageTitle: "Thông tin cá nhân",
  });
};

// [GET] /admin/my-account/edit
module.exports.edit = async (req, res) => {
  res.render("admin/pages/my-account/edit", {
    pageTitle: "Chỉnh sửa hông tin cá nhân",
  });
};

// [PATCH] /admin/my-account/edit
module.exports.editPatch = async (req, res) => {
  try {
    const id = res.locals.user.id;
    const exitEmail = await Accounts.find({
      _id: { $ne: id },
      deleted: false,
      email: req.body.email,
    });

    if (exitEmail.length > 0) {
      console.log("Email tồn tại");
      req.flash("error", `Email ${req.body.email} đã tồn tại`);
      res.redirect(`back`);
    } else {
      if (req.body.password) {
        req.body.password = md5(req.body.password);
      } else {
        delete req.body.password;
      }

      await Accounts.updateOne({ _id: id }, req.body);
      req.flash("success", `Sửa tài khoản thành công!!`);
      res.redirect(`${systemAdmin.prefitAdmin}/my-account`);
    }
  } catch (error) {
    console.log(error);
    req.flash("error", `Sửa tài khoản thất bại!!`);
    res.redirect(`${systemAdmin.prefitAdmin}/my-account`);
  }
};
