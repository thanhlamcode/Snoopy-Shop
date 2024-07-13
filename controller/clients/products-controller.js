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

// [GET] /products/detail
module.exports.detail = async (req, res) => {
  const slug = req.params.slug;
  const item = await Product.findOne({
    slug: slug,
    status: "active",
  });
  const newPrice = Math.round(item.price * (1 - item.discountPercentage / 100));
  item.newPrice = newPrice;
  console.log(item);
  res.render("client/pages/products/detail", {
    pageTitle: item.title,
    item: item,
  });
};
