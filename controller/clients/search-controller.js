const Product = require("../../models/products.model");
const productCategoryHelper = require("../../helpers/products");

// [GET] /products
module.exports.index = async (req, res) => {
  const keyword = req.query.keyword;
  console.log(keyword);

  let products = [];

  const regex = RegExp(keyword, "i");

  products = await Product.find({
    title: regex,
    deleted: false,
  });

  productCategoryHelper.products(products);
  res.render("client/pages/search/index", {
    pageTitle: "Trang tìm kiếm",
    products: products,
    keyword: keyword,
  });
};
