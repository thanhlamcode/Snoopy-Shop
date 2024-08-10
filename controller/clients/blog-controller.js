const Blog = require("../../models/blog.model");
const BlogCategory = require("../../models/blog-category.model");
const productCategoryHelper = require("../../helpers/products-category");

// [GET] /blog
module.exports.index = async (req, res) => {
  const blog = await Blog.find({
    deleted: false,
    status: "active",
  }).sort({ position: "desc" });

  const blogNew = await Blog.find({
    deleted: false,
    status: "active",
  })
    .sort({ position: "desc" })
    .limit(6);

  // console.log(blogNew);
  blogNew.forEach((item) => {
    console.log(item.createBy.createAt);
  });

  res.render("client/pages/blog/index", {
    pageTitle: "Trang bài viết",
    blog: blog,
    blogNew: blogNew,
  });
};

// [GET] /blog/detail/:slug
module.exports.detail = async (req, res) => {
  const slug = req.params.slug;
  const item = await Blog.findOne({
    slug: slug,
    status: "active",
  });
  const newPrice = Math.round(item.price * (1 - item.discountPercentage / 100));
  item.newPrice = newPrice;

  if (item.product_category_id) {
    const productCategory = await BlogCategory.findOne({
      deleted: false,
      status: "active",
      _id: item.product_category_id,
    });
    item.productCategory = productCategory;
  }

  res.render("client/pages/blog/detail", {
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
