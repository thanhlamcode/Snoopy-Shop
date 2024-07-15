const ProductCategory = require("../../models/products-category");
const systemAdmin = require("../../config/systems");
// [GET] /admin/products-category
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };

  const record = await ProductCategory.find(find);

  res.render("admin/pages/products-category/index", {
    pageTitle: "Trang danh mục sản phẩm",
    record: record,
  });
};

// [GET] /admin/products-category/create
module.exports.create = (req, res) => {
  res.render("admin/pages/products-category/create", {
    pageTitle: "Trang thêm mới danh mục sản phẩm",
  });
};

// [POST] /admin/products-category/create
module.exports.createPost = async (req, res) => {
  const countProducts = await ProductCategory.countDocuments();
  if (req.body.position === "") {
    req.body.position = countProducts + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }

  const record = new ProductCategory(req.body);
  await record.save();
  console.log(req.body);
  res.redirect(`${systemAdmin.prefitAdmin}/products-category`);
};
