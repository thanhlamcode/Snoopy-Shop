const Accounts = require("../../models/accounts.model");
const Blog = require("../../models/blog.model");
const filterStatus = require("../../helpers/filterStatus");
const paginationObject = require("../../helpers/pagination");
const systemAdmin = require("../../config/systems");

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

  const countBlog = await Blog.countDocuments();
  res.render("admin/pages/blog/create", {
    pageTitle: "Trang thêm Bài viết",
    max: countBlog,
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
