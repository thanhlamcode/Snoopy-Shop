const Accounts = require("../../models/accounts.model");
const Role = require("../../models/role.model");
const systemAdmin = require("../../config/systems");
const md5 = require("md5");

// [GET] /admin/accounts
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };

  const records = await Accounts.find(find).select("-password -token");

  for (const record of records) {
    const role = await Role.findOne({
      deleted: false,
      _id: record.role_id,
    });
    record.role = role;
  }

  console.log(records);

  res.render("admin/pages/accounts/index", {
    pageTitle: "Danh sách tài khoản",
    records: records,
  });
};

// [GET] /admin/accounts/create
module.exports.create = async (req, res) => {
  const roles = await Role.find({ deleted: false });

  res.render("admin/pages/accounts/create", {
    pageTitle: "Tạo tài khoản",
    roles: roles,
  });
};

// [POST] /admin/accounts/create
module.exports.createPost = async (req, res) => {
  const exitEmail = await Accounts.find({
    deleted: false,
    email: req.body.email,
  });
  req.body.password = md5(req.body.password);

  if (exitEmail.length > 0) {
    console.log("Email tồn tại");
    req.flash("error", `Email ${req.body.email} đã tồn tại`);
    res.redirect(`back`);
  } else {
    const records = new Accounts(req.body);
    await records.save();
    req.flash("success", `Tạo tài khoản thành công !`);
    res.redirect(`${systemAdmin.prefitAdmin}/accounts`);
  }
};
