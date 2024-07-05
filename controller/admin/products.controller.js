const Product = require("../../models/products.model");
const filterStatus = require("../../helpers/filterStatus");
const paginationObject = require("../../helpers/pagination");

// [GET /admin/products]
module.exports.products = async (req, res) => {
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

  // PAGINATION
  const totalItem = await Product.countDocuments(find);
  const pagination = paginationObject(
    {
      currentPage: 1,
      limit: 5,
    },
    req,
    totalItem
  );

  // END PAGINATION

  const products = await Product.find(find)
    .limit(pagination.limit)
    .skip(pagination.skip);
  res.render("admin/pages/products/index", {
    pageTitle: "Trang Sản phẩm",
    products: products,
    button: filter,
    keyword: keyword,
    pagination: pagination,
  });
};

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;

  await Product.updateOne({ _id: id }, { status: status });

  res.redirect("back");
};

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(",");

  await Product.updateMany(
    { _id: { $in: ids } }, // Điều kiện: _id nằm trong mảng ids
    { $set: { status: type } } // Cập nhật type
  );
  res.redirect("back");
};

// [PATCH] /admin/products/change-status/:status/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;
  // console.log(id);

  // await Product.deleteOne({ _id: id });
  await Product.updateOne(
    { _id: id },
    { deleted: true, deletedAt: new Date() }
  );

  res.redirect("back");
};

// [GET /admin/products/restore]
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

  // PAGINATION
  const totalItem = await Product.countDocuments(find);
  const pagination = paginationObject(
    {
      currentPage: 1,
      limit: 5,
    },
    req,
    totalItem
  );

  // END PAGINATION

  const products = await Product.find(find)
    .limit(pagination.limit)
    .skip(pagination.skip);
  res.render("admin/pages/products/productsRestore", {
    pageTitle: "Trang Khôi phục sản phẩm",
    products: products,
    button: filter,
    keyword: keyword,
    pagination: pagination,
  });
};

// [PATCH] /admin/products/restore/:id
module.exports.restoreProducts = async (req, res) => {
  const id = req.params.id;
  await Product.updateOne({ _id: id }, { deleted: false });

  res.redirect("back");
};
