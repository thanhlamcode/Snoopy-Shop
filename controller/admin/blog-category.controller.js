const BlogCategory = require("../../models/blog-category.model");
const Accounts = require("../../models/accounts.model");
const systemAdmin = require("../../config/systems");
const filterStatus = require("../../helpers/filterStatus");
const paginationObject = require("../../helpers/pagination");
const treeHelper = require("../../helpers/createTree");

// [GET] /admin/blog-category
module.exports.index = async (req, res) => {
  // filter
  const filter = filterStatus(req);

  let find = {
    deleted: false,
  };

  if (req.query.status) {
    find.status = req.query.status;
  }

  let keyword = "";

  if (req.query.keyword) {
    keyword = req.query.keyword;
    const regex = new RegExp(keyword, "i");
    find.title = regex;
  }
  //filter

  // PAGINATION
  const totalItem = await BlogCategory.countDocuments(find);
  const pagination = paginationObject(
    {
      currentPage: 1,
      limit: 5,
    },
    req,
    totalItem
  );

  // END PAGINATION

  // SORT
  const sort = {};

  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  } else {
    sort.position = "desc";
  }
  // END SORT

  const records = await BlogCategory.find(find).sort(sort);

  const newRecords = treeHelper.tree(records);

  for (item of newRecords) {
    console.log(item.createBy.account_id);
    if (item.createBy.account_id) {
      const creator = await Accounts.findOne({ _id: item.createBy.account_id });
      if (creator) {
        item.fullName = creator.fullName;
      }
    }
  }

  res.render("admin/pages/blog-category/index", {
    pageTitle: "Trang danh mục bài viết",
    record: newRecords,
    button: filter,
    keyword: keyword,
    pagination: pagination,
  });
};

// [GET] /admin/blog-category/create
module.exports.create = async (req, res) => {
  const find = {
    deleted: false,
  };

  const records = await BlogCategory.find(find);

  const newRecords = treeHelper.tree(records);

  res.render("admin/pages/blog-category/create", {
    pageTitle: "Trang thêm mới danh mục bài viết",
    records: newRecords,
  });
};

// [POST] /admin/blog-category/create
module.exports.createPost = async (req, res) => {
  const countProducts = await BlogCategory.countDocuments();
  if (req.body.position === "") {
    req.body.position = countProducts + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }

  const creator = await Accounts.findOne({ _id: res.locals.user.id });
  console.log(creator.id);

  req.body.createBy = {
    account_id: creator.id,
  };
  console.log(req.body);
  const record = new BlogCategory(req.body);
  await record.save();
  console.log(req.body);
  res.redirect(`${systemAdmin.prefitAdmin}/blog-category`);
};

// [PATCH] /admin/blog-category/change-multi
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(",");

  if (ids.length > 0) {
    if (type == "delete-all") {
      await BlogCategory.updateMany(
        { _id: { $in: ids } },
        { $set: { deleted: true } }
      );
      req.flash("success", `Xóa thành công ${ids.length} danh mục bài viết !`);
      res.redirect("back");
    } else if (type == undefined) {
      // return;
      res.redirect("back");
    } else if (type == "change-position") {
      // res.send("ok");
      ids.forEach(async (item, index) => {
        item = ids[index].split(",");
        const data = item[0].split("-");
        // console.log(data[1]);
        await BlogCategory.updateOne(
          { _id: data[0] },
          { position: parseInt(data[1]) }
        );
      });
      req.flash(
        "success",
        `Thay đổi vị trí thành công ${ids.length} danh mục bài viết !`
      );
      res.redirect("back");
    } else {
      await BlogCategory.updateMany(
        { _id: { $in: ids } },
        { $set: { status: type } }
      );
      req.flash(
        "success",
        `Cập nhập trạng thái thành công ${ids.length} danh mục bài viết !`
      );
      res.redirect("back");
    }
  } else {
  }
};

// [PATCH] /admin/blog-category/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;

  await BlogCategory.updateOne({ _id: id }, { status: status });
  req.flash("success", "Cập nhập trạng thái thành công!");

  res.redirect("back");
};

// [PATCH] /admin/blog-category/delete/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;

  await BlogCategory.updateOne(
    { _id: id },
    { deleted: true, deletedAt: new Date() }
  );
  req.flash("success", `Xóa danh mục bài viết thành công !`);
  res.redirect("back");
};

//[GET] admin/blog-category/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;
    const item = await BlogCategory.findOne({ _id: id });
    res.render("admin/pages/blog-category/detail", {
      pageTitle: item.title,
      item: item,
    });
  } catch (error) {
    res.redirect(`${systemAdmin.prefitAdmin}/blog-category`);
  }
};

//[GET] admin/blog-category/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;

    const find = {
      deleted: false,
    };

    const records = await BlogCategory.find(find);

    const newRecords = treeHelper.tree(records);

    const item = await BlogCategory.findOne({ _id: id });
    let itemParent = null;
    if (item.parent_id && item.parent_id !== "") {
      itemParent = await BlogCategory.findOne({ _id: item.parent_id });
    }

    res.render("admin/pages/blog-category/edit", {
      pageTitle: "Trang chỉnh sửa DM Bài Viết",
      item: item,
      itemParent: itemParent,
      records: newRecords,
    });
  } catch (error) {
    res.redirect(`${systemAdmin.prefitAdmin}/blog-category`);
  }
};

//[PATCH] admin/blog-category/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const item = await BlogCategory.findOne({ _id: id });

    req.body.position = parseInt(req.body.position);

    console.log(req.body);
    await BlogCategory.updateOne({ _id: id }, req.body);
    req.flash("success", `Sửa sản phẩm thành công!!`);
    res.redirect(`${systemAdmin.prefitAdmin}/blog-category`);
  } catch (error) {
    req.flash("error", `Sửa sản phẩm thất bại!!`);
    res.redirect(`${systemAdmin.prefitAdmin}/blog-category`);
  }
};
