const Product = require("../../models/products.model");
const ProductCategory = require("../../models/products-category");
const productCategoryHelper = require("../../helpers/products-category");

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

// [GET] /products/:category
module.exports.category = async (req, res) => {
  const slugCategory = req.params.category;

  const productCategory = await ProductCategory.findOne({
    slug: slugCategory,
    deleted: false,
    status: "active",
  });

  const list = await productCategoryHelper.getSubCategory(productCategory.id);

  const listIdCategory = list.map((item) => item.id);

  console.log(listIdCategory);

  const products = await Product.find({
    product_category_id: { $in: [productCategory.id, ...listIdCategory] },
    deleted: false,
    status: "active",
  }).sort({ position: "desc" });

  res.render("client/pages/products/category", {
    pageTitle: productCategory.title,
    products: products,
  });
};
