const Blog = require("../../models/blog.model");
const BlogCategory = require("../../models/blog-category.model");
const productCategoryHelper = require("../../helpers/products-category");

// [GET] /chat
module.exports.index = async (req, res) => {
  res.render("client/pages/chat/index", {
    pageTitle: "Chat",
  });
};
