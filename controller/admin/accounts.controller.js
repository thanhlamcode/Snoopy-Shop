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

  for (item of records) {
    console.log(item.createBy.account_id);
    if (item.createBy.account_id) {
      const creator = await Accounts.findOne({ _id: item.createBy.account_id });
      if (creator) {
        item.creatorName = creator.fullName;
      }
    }
  }

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
    roleCreateAccount: roles,
  });
};

// [POST] /admin/accounts/create
module.exports.createPost = async (req, res) => {
  const permission = res.locals.roles.permissions;

  if (permission.includes("accounts_create")) {
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
      const creator = await Accounts.findOne({ _id: res.locals.user.id });
      console.log(creator.id);

      req.body.createBy = {
        account_id: creator.id,
      };

      const records = new Accounts(req.body);
      await records.save();
      req.flash("success", `Tạo tài khoản thành công !`);
      res.redirect(`${systemAdmin.prefitAdmin}/accounts`);
    }
  } else {
    return;
  }
};

//[GET] admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;

    const find = {
      deleted: false,
      _id: id,
    };
    const roles = await Role.find({
      deleted: false,
    });

    const records = await Accounts.find(find).select("-password -token");

    for (const record of records) {
      const role = await Role.findOne({
        deleted: false,
        _id: record.role_id,
      });
      record.role = role;
    }

    res.render("admin/pages/accounts/edit", {
      pageTitle: "Trang chỉnh sửa Tài khoản",
      item: records[0],
      roleCreateAccount: roles,
    });
  } catch (error) {
    res.redirect(`${systemAdmin.prefitAdmin}/accounts`);
  }
};

//[PATCH] admin/accounts/edit/:id
module.exports.editPatch = async (req, res) => {
  const permission = res.locals.roles.permissions;
  if (permission.includes("accounts_edit")) {
    try {
      const id = req.params.id;
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
        res.redirect(`${systemAdmin.prefitAdmin}/accounts`);
      }
    } catch (error) {
      req.flash("error", `Sửa tài khoản thất bại!!`);
      res.redirect(`${systemAdmin.prefitAdmin}/accounts`);
    }
  } else {
    return;
  }
};

//[DELETE] admin/accounts/delete/:id
module.exports.deleteItem = async (req, res) => {
  const permission = res.locals.roles.permissions;
  if (permission.includes("accounts_delete")) {
    try {
      const id = req.params.id;
      console.log(id);

      const deletor = await Accounts.findOne({ _id: res.locals.user.id });
      console.log(deletor.id);

      await Accounts.updateOne(
        { _id: id },
        {
          deleted: true,
          deletedBy: {
            account_id: res.locals.user.id,
            deletedAt: Date.now(),
          },
        }
      );
      req.flash("success", `Xóa tài khoản thành công!`);
      res.redirect("back");
    } catch (error) {
      req.flash("error", `Xóa tài khoản thất bại!!`);
      res.redirect(`${systemAdmin.prefitAdmin}/accounts`);
    }
  } else {
    return;
  }
};

//[PATCH] admin/accounts/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const permission = res.locals.roles.permissions;
  if (permission.includes("accounts_edit")) {
    try {
      const id = req.params.id;
      const status = req.params.status;

      await Accounts.updateOne({ _id: id }, { status: status });
      req.flash("success", `Thay đổi trạng thái thành công!`);
      res.redirect("back");
    } catch (error) {
      req.flash("error", `Thay đổi trạng thái thất bại!!`);
      res.redirect(`${systemAdmin.prefitAdmin}/accounts`);
    }
  } else {
    return;
  }
};
