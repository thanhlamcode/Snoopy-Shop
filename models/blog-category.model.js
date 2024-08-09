const mongoose = require("mongoose");

const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);
const blogCategorySchema = new mongoose.Schema(
  {
    title: String,
    parent_id: {
      type: String,
      default: "",
    },
    createBy: {
      account_id: String,
      createAt: {
        type: Date,
        default: Date.now,
      },
    },
    description: String,
    thumbnail: String,
    status: String,
    position: Number,
    slug: { type: String, slug: "title", unique: true },
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);

const BlogCategory = mongoose.model(
  "BlogCategory",
  blogCategorySchema,
  "blog-category"
);

module.exports = BlogCategory;
