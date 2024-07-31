const mongoose = require("mongoose");

const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);
const blogSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    shortDescription: String,
    thumbnail: String,
    status: String,
    position: Number,
    createBy: {
      account_id: String,
      createAt: {
        type: Date,
        default: Date.now,
      },
    },
    deletedBy: {
      account_id: String,
      deletedAt: {
        type: Date,
        default: Date,
      },
    },
    updatedBy: [
      {
        account_id: String,
        updatedAt: {
          type: Date,
          default: Date,
        },
      },
    ],
    slug: { type: String, slug: "title", unique: true },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Blog = mongoose.model("Blog", blogSchema, "blog");

module.exports = Blog;
