const Blog = require("../../models/blog.model");
const BlogCategory = require("../../models/blog-category.model");
const productCategoryHelper = require("../../helpers/products-category");

// [GET] /chat
module.exports.index = async (req, res) => {
  _io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);
  });

  res.render("client/pages/chat/index", {
    pageTitle: "Chat",
  });
};
