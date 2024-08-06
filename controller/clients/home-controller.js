const Product = require("../../models/products.model");

// [GET] /
module.exports.index = async (req, res) => {
  const products = await Product.find({
    deleted: false,
    status: "active",
    featured: "1",
  }).limit(6);

  products.forEach((item) => {
    const newPrice = Math.round(
      (item.price * (100 - item.discountPercentage)) / 100
    );
    item.newPrice = newPrice;
    const discountPrice = item.price - item.newPrice;
    item.discountPrice = discountPrice;
  });
  // console.log(products);

  res.render("client/pages/home/index", {
    pageTitle: "Trang chủ",
    products: products,
  });
};
