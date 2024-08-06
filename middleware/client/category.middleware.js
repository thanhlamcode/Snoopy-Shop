const ProductCategory = require("../../models/products-category");
const treeHelper = require("../../helpers/createTree");

module.exports.category = async (req, res, next) => {
  try {
    const find = {
      deleted: false,
      status: "active",
    };

    const records = await ProductCategory.find(find);
    const layout = treeHelper.tree(records);
    res.locals.layout = layout;

    next();
  } catch (error) {
    next(error);
  }
};
