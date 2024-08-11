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
  const blogNew = await Blog.find({
    deleted: false,
    status: "active",
  })
    .sort({ position: "desc" })
    .limit(6);

  if (item.blog_category_id) {
    const blogCategory = await BlogCategory.findOne({
      deleted: false,
      status: "active",
      _id: item.blog_category_id,
    });
    item.blogCategory = blogCategory;
  }

  res.render("client/pages/blog/detail", {
    pageTitle: item.title,
    item: item,
    blogNew: blogNew,
  });
};

// [GET] /products/:category
module.exports.category = async (req, res) => {
  const slugCategory = req.params.category;

  const blogCategory = await BlogCategory.findOne({
    slug: slugCategory,
    deleted: false,
    status: "active",
  });

  const list = await productCategoryHelper.getSubBlogCategory(blogCategory.id);

  const listIdCategory = list.map((item) => item.id);

  console.log(listIdCategory);

  const blogs = await Blog.find({
    blog_category_id: { $in: [blogCategory.id, ...listIdCategory] },
    deleted: false,
    status: "active",
  }).sort({ position: "desc" });

  res.render("client/pages/blog/category", {
    pageTitle: blogCategory.title,
    blogs: blogs,
  });
};
