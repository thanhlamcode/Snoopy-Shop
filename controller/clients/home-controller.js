const Product = require("../../models/products.model");
const productHelper = require("../../helpers/products");

// [GET] /
module.exports.index = async (req, res) => {
  const products = await Product.find({
    deleted: false,
    status: "active",
    featured: "1",
  }).limit(6);

  const productsNew = await Product.find({
    deleted: false,
    status: "active",
  })
    .sort({ position: "desc" })
    .limit(6);

  productHelper.products(products);
  productHelper.products(productsNew);

  res.render("client/pages/home/index", {
    pageTitle: "Trang chủ",
    products: products,
    productsNew: productsNew,
  });
};
