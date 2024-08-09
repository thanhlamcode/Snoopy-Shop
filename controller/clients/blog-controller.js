const Cart = require("../../models/cart.model");
const productHelper = require("../../helpers/products");

// [GET] /
module.exports.index = async (req, res) => {
  res.render("client/pages/blog/index", {
    pageTitle: "Bài viết",
  });
};
