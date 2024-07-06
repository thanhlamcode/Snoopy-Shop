const Product = require("../../models/products.model");

// [GET] /products
module.exports.index = async (req, res) => {
  const products = await Product.find({
    deleted: false,
    status: "active",
  }).sort({ position: "desc" });
  console.log(products);
  res.render("client/pages/products/index", {
    pageTitle: "Trang sản phẩm",
    products: products,
  });
};
