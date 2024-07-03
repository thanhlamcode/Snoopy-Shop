const Product = require("../../models/products.model");

const filterStatus = require("../../helpers/filterStatus");

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
  let pagination = {
    currentPage: 1,
    limit: 5,
  };

  let page = req.query.page;
  if (page) {
    pagination.currentPage = parseInt(page);
  }

  const skip = Math.ceil((pagination.currentPage - 1) * pagination.limit);
  // console.log(skip);

  const totalItem = await Product.countDocuments(find);
  const totalPage = Math.ceil(totalItem / pagination.limit);
  pagination.totalPage = totalPage;
  // console.log(pagination.totalPage);

  // END PAGINATION

  const products = await Product.find(find).limit(pagination.limit).skip(skip);
  res.render("admin/pages/products/index", {
    pageTitle: "Trang Sản phẩm",
    products: products,
    button: filter,
    keyword: keyword,
    pagination: pagination,
  });
};
