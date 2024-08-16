const User = require("../../models/users.model");
const filterStatus = require("../../helpers/filterStatus");
const paginationObject = require("../../helpers/pagination");

// GET /admin/user
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
    find.fullName = regex;
  }
  //filter

  // PAGINATION
  const totalItem = await User.countDocuments(find);
  const pagination = paginationObject(
    {
      currentPage: 1,
      limit: 20,
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
    sort.createdAt = "desc";
  }
  // END SORT

  const products = await User.find(find)
    .sort(sort)
    .limit(pagination.limit)
    .skip(pagination.skip);

  res.render("admin/pages/user/index", {
    pageTitle: "Trang Sản phẩm",
    products: products,
    button: filter,
    keyword: keyword,
    pagination: pagination,
  });
};

// [PATCH] /admin/user/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;

  await User.updateOne({ _id: id }, { status: status });
  req.flash("success", "Cập nhập trạng thái thành công!");

  res.redirect("back");
};
