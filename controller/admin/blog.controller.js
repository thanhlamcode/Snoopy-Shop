const Accounts = require("../../models/accounts.model");
const Blog = require("../../models/blog.model");
const BlogCategory = require("../../models/blog-category.model");
const filterStatus = require("../../helpers/filterStatus");
const paginationObject = require("../../helpers/pagination");
const systemAdmin = require("../../config/systems");
const treeHelper = require("../../helpers/createTree");

// [GET] /admin/blog
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
  const totalItem = await Blog.countDocuments(find);
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

  const blogs = await Blog.find(find)
    .sort(sort)
    .limit(pagination.limit)
    .skip(pagination.skip);

  for (const blog of blogs) {
    const creator = await Accounts.findOne({
      _id: blog.createBy.account_id,
    });
    if (creator) {
      blog.creator = creator.fullName;
    }
  }

  res.render("admin/pages/blog/index", {
    pageTitle: "Trang Danh sách bài viết",
    blogs: blogs,
    button: filter,
    keyword: keyword,
    pagination: pagination,
  });
};

//[GET] /admin/blog/create
module.exports.create = async (req, res) => {
  const find = {
    deleted: false,
  };

  const records = await BlogCategory.find(find);
  const newRecords = treeHelper.tree(records);

  const countBlog = await Blog.countDocuments();
  res.render("admin/pages/blog/create", {
    pageTitle: "Trang thêm Bài viết",
    max: countBlog,
    records: newRecords,
  });
};

//[POST] /admin/blog/create
module.exports.createPost = async (req, res) => {
  if (!req.body.title) {
    req.flash("error", `Vui lòng thêm tiêu đề bài viết!!`);
    res.redirect("back");
    return;
  }

  const countBlog = await Blog.countDocuments();

  if (req.body.position === "") {
    req.body.position = countBlog + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }

  req.body.createBy = {
    account_id: res.locals.user.id,
  };

  const blog = new Blog(req.body);
  await blog.save();

  res.redirect(`${systemAdmin.prefitAdmin}/blog`);
};

// [PATCH] /admin/blog/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;

  const updatedBy = {
    account_id: res.locals.user.id,
    updatedAt: new Date(),
  };
  console.log(status);
  console.log(id);

  await Blog.updateOne(
    { _id: id },
    { status: status, $push: { updatedBy: updatedBy } }
  );
  req.flash("success", "Cập nhập trạng thái thành công!");

  res.redirect("back");
};

// [PATCH] /admin/blog/change-multi
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(",");

  const updatedBy = {
    account_id: res.locals.user.id,
    updatedAt: new Date(),
  };

  if (ids.length > 0) {
    if (type == "delete-all") {
      await Blog.updateMany(
        { _id: { $in: ids } },
        {
          $set: {
            deleted: true,
            deletedBy: {
              account_id: res.locals.user.id,
              deletedAt: new Date(),
            },
          },
        }
      );
      req.flash("success", `Xóa thành công ${ids.length} sản phẩm !`);
      res.redirect("back");
    } else if (type == undefined) {
      // return;
      res.redirect("back");
    } else if (type == "change-position") {
      // res.send("ok");
      ids.forEach(async (item, index) => {
        item = ids[index].split(",");
        const data = item[0].split("-");
        await Blog.updateOne(
          { _id: data[0] },
          { position: parseInt(data[1]), $push: { updatedBy: updatedBy } }
        );
      });
      req.flash(
        "success",
        `Thay đổi vị trí thành công ${ids.length} sản phẩm !`
      );
      res.redirect("back");
    } else {
      await Blog.updateMany(
        { _id: { $in: ids } },
        { $set: { status: type }, $push: { updatedBy: updatedBy } }
      );
      req.flash(
        "success",
        `Cập nhập trạng thái thành công ${ids.length} sản phẩm !`
      );
      res.redirect("back");
    }
  }
};

//[GET] admin/blog/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const find = {
      deleted: false,
    };
    const id = req.params.id;
    const item = await Blog.findOne({ _id: id });
    const records = await BlogCategory.find(find);

    const newRecords = treeHelper.tree(records);

    res.render("admin/pages/blog/edit", {
      pageTitle: item.title,
      item: item,
      records: newRecords,
    });
  } catch (error) {
    res.redirect(`${systemAdmin.prefitAdmin}/blog`);
    console.log(error);
  }
};

//[PATCH] admin/blog/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;

    req.body.position = parseInt(req.body.position);

    // console.log(req.body);

    const updatedBy = {
      account_id: res.locals.user.id,
      updatedAt: new Date(),
    };
    console.log(req.body);
    await Blog.updateOne(
      { _id: id },
      {
        ...req.body,
        $push: { updatedBy: updatedBy },
      }
    );
    req.flash("success", `Sửa bài viết thành công!!`);
    res.redirect(`${systemAdmin.prefitAdmin}/blog`);
  } catch (error) {
    req.flash("error", `Sửa bài viết thất bại!!`);
    res.redirect(`${systemAdmin.prefitAdmin}/blog`);
  }
};

//[GET] admin/blog/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;
    const item = await Blog.findOne({ _id: id });
    // Category title
    let category = {};
    if (item.blog_category_id) {
      category = await BlogCategory.findOne({
        _id: item.blog_category_id,
      });
    }
    //end category

    res.render("admin/pages/blog/detail", {
      pageTitle: item.title,
      item: item,
      category: category.title,
    });
  } catch (error) {
    res.redirect(`${systemAdmin.prefitAdmin}/blog`);
    console.log(error);
  }
};

// [PATCH] /admin/blog/delete/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;
  await Blog.updateOne(
    { _id: id },
    {
      deleted: true,
      deletedBy: {
        account_id: res.locals.user.id,
        deletedAt: new Date(),
      },
    }
  );
  req.flash("success", `Xóa bài viết thành công !`);
  res.redirect("back");
};

// [GET] /admin/blog/restore
module.exports.restore = async (req, res) => {
  // filter
  const filter = filterStatus(req);

  let find = {
    deleted: true,
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
  //end filter

  // PAGINATION
  const totalItem = await Blog.countDocuments(find);
  const pagination = paginationObject(
    {
      currentPage: 1,
      limit: 5,
    },
    req,
    totalItem
  );

  // END PAGINATION

  const blogs = await Blog.find(find)
    .sort({ "deletedBy.deletedAt": -1 })
    .limit(pagination.limit)
    .skip(pagination.skip);

  for (const blog of blogs) {
    const deletor = await Accounts.findOne({
      _id: blog.deletedBy.account_id,
    });
    if (deletor) {
      blog.deletor = deletor.fullName;
    }
  }

  res.render("admin/pages/blog/restore", {
    pageTitle: "Trang Khôi phục Bài viết",
    blogs: blogs,
    button: filter,
    keyword: keyword,
    pagination: pagination,
  });
};

// [PATCH] /admin/blog/restore/:id
module.exports.restoreBlog = async (req, res) => {
  const id = req.params.id;
  await Blog.updateOne({ _id: id }, { deleted: false });
  req.flash("success", `Khôi phục bài viết thành công !`);
  res.redirect("back");
};

// [PATCH] /admin/blog/restoreMulti
module.exports.restoreMulti = async (req, res) => {
  const ids = req.body.ids.split(",");
  console.log(ids);

  await Blog.updateMany({ _id: { $in: ids } }, { $set: { deleted: false } });
  req.flash("success", `Khôi phục ${ids.length} bài viết thành công !`);
  res.redirect("back");
};

//[GET] admin/blog/historyEdit/:id
module.exports.historyEdit = async (req, res) => {
  try {
    const id = req.params.id;
    const item = await Blog.findOne({ _id: id });

    const updatedBy = item.updatedBy;
    for (const updateItem of updatedBy) {
      const updater = await Accounts.findOne({ _id: updateItem.account_id });
      updateItem.updater = updater;
    }

    // Log updatedBy để kiểm tra kết quả
    console.log(updatedBy);
    updatedBy.slice(-10);

    res.render("admin/pages/blog/historyEdit", {
      pageTitle: item.title,
      item: item,
      updatedBy: updatedBy.reverse(),
    });
  } catch (error) {
    res.redirect(`${systemAdmin.prefitAdmin}/blog`);
    console.log(error);
  }
};
