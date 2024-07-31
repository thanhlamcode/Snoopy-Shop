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
    const id = req.params.id;
    const item = await Blog.findOne({ _id: id });

    res.render("admin/pages/blog/edit", {
      pageTitle: item.title,
      item: item,
    });
  } catch (error) {
    res.redirect(`${systemAdmin.prefitAdmin}/blog`);
    console.log(error);
  }
};

//[PATCH] admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;

    req.body.position = parseInt(req.body.position);

    console.log(req.body);

    const updatedBy = {
      account_id: res.locals.user.id,
      updatedAt: new Date(),
    };

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

//[GET] admin/products/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;
    const item = await Blog.findOne({ _id: id });
    res.render("admin/pages/blog/detail", {
      pageTitle: item.title,
      item: item,
    });
  } catch (error) {
    res.redirect(`${systemAdmin.prefitAdmin}/blog`);
    console.log(error);
  }
};
