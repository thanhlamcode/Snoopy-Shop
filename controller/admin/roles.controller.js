const Role = require("../../models/role.model");
const systemAdmin = require("../../config/systems");

// [GET] /admin/roles
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };

  const records = await Role.find(find);

  res.render("admin/pages/roles/index", {
    pageTitle: "Nhóm quyền",
    records: records,
  });
};

// [GET] /admin/roles/create
module.exports.create = (req, res) => {
  res.render("admin/pages/roles/create", {
    pageTitle: "Tạo nhóm quyền",
  });
};

// [POST] /admin/roles/create
module.exports.createPost = async (req, res) => {
  console.log(req.body);

  const records = Role(req.body);
  await records.save();
  res.redirect(`${systemAdmin.prefitAdmin}/roles`);
};

// [GET] /admin/roles/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    const item = await Role.findOne({ _id: id });
    res.render("admin/pages/roles/edit", {
      pageTitle: "Trang chỉnh sửa Nhóm quyền",
      item: item,
    });
  } catch (error) {
    res.redirect(`${systemAdmin.prefitAdmin}/roles`);
  }
};

// [PATCH] /admin/roles/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(req.body);
    await Role.updateOne({ _id: id }, req.body);
    req.flash("success", `Cập nhập quyền thành công!!`);
    res.redirect(`${systemAdmin.prefitAdmin}/roles`);
  } catch (error) {
    req.flash("error", `Cập nhập quyền thất bại!!`);
    res.redirect(`${systemAdmin.prefitAdmin}/roles`);
  }
};

// [DELETE] /admin/roles/delete/:id
module.exports.deleteItem = async (req, res) => {
  try {
    const id = req.params.id;
    await Role.updateOne({ _id: id }, { deleted: true });
    req.flash("success", `Xóa nhóm quyền thành công!!`);
    res.redirect(`${systemAdmin.prefitAdmin}/roles`);
  } catch (error) {
    req.flash("error", `Xóa nhóm quyền thất bại!!`);
    res.redirect(`${systemAdmin.prefitAdmin}/roles`);
  }
};
