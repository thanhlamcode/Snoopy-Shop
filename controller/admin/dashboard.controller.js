const ProductCategory = require("../../models/products-category");
const Product = require("../../models/products.model");
const BlogCategory = require("../../models/blog-category.model");
const Blog = require("../../models/blog.model");
const Account = require("../../models/accounts.model");
const User = require("../../models/users.model");
const Order = require("../../models/order.model");

// [GET] /admin/dashboard
module.exports.dashboard = async (req, res) => {
  const statistic = {
    categoryProduct: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    product: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    categoryBlog: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    blog: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    account: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    user: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    deletedProduct: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    deletedBlog: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    order: {
      total: 0,
      active: 0,
      inactive: 0,
    },
  };

  statistic.categoryProduct.total = await ProductCategory.countDocuments({
    deleted: false,
  });

  statistic.categoryProduct.active = await ProductCategory.countDocuments({
    deleted: false,
    status: "active",
  });

  statistic.categoryProduct.inactive = await ProductCategory.countDocuments({
    deleted: false,
    status: "unactive",
  });

  statistic.product.total = await Product.countDocuments({
    deleted: false,
  });

  statistic.product.active = await Product.countDocuments({
    deleted: false,
    status: "active",
  });

  statistic.product.inactive = await Product.countDocuments({
    deleted: false,
    status: "unactive",
  });

  statistic.categoryBlog.total = await BlogCategory.countDocuments({
    deleted: false,
  });

  statistic.categoryBlog.active = await BlogCategory.countDocuments({
    deleted: false,
    status: "active",
  });

  statistic.categoryBlog.inactive = await BlogCategory.countDocuments({
    deleted: false,
    status: "unactive",
  });

  statistic.blog.total = await Blog.countDocuments({
    deleted: false,
  });

  statistic.blog.active = await Blog.countDocuments({
    deleted: false,
    status: "active",
  });

  statistic.blog.inactive = await Blog.countDocuments({
    deleted: false,
    status: "unactive",
  });

  statistic.account.total = await Account.countDocuments({
    deleted: false,
  });

  statistic.account.active = await Account.countDocuments({
    deleted: false,
    status: "active",
  });

  statistic.account.inactive = await Account.countDocuments({
    deleted: false,
    status: "unactive",
  });

  statistic.user.total = await User.countDocuments({
    deleted: false,
  });

  statistic.user.active = await User.countDocuments({
    deleted: false,
    status: "active",
  });

  statistic.user.inactive = await User.countDocuments({
    deleted: false,
    status: "unactive",
  });

  statistic.deletedProduct.total = await Product.countDocuments({
    deleted: true,
  });

  statistic.deletedProduct.active = await Product.countDocuments({
    deleted: true,
    status: "active",
  });

  statistic.deletedProduct.inactive = await Product.countDocuments({
    deleted: true,
    status: "unactive",
  });

  statistic.deletedBlog.total = await Blog.countDocuments({
    deleted: true,
  });

  statistic.deletedBlog.active = await Blog.countDocuments({
    deleted: true,
    status: "active",
  });

  statistic.deletedBlog.inactive = await Blog.countDocuments({
    deleted: true,
    status: "unactive",
  });

  statistic.order.total = await Order.countDocuments({
    deleted: false,
  });

  statistic.order.active = await Order.countDocuments({
    deleted: false,
    status_payment: true,
  });

  statistic.order.inactive = await Order.countDocuments({
    deleted: false,
    status_payment: false,
  });

  res.render("admin/pages/dashboard/index", {
    pageTitle: "Trang tổng quan",
    statistic: statistic,
  });
};
