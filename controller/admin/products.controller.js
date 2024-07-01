module.exports.products = (req, res) => {
  res.render("admin/pages/products/index", {
    pageTitle: "Trang Sản phẩm",
  });
};
