const systemAdmin = require("../../config/systems");
const dashboardRouter = require("./dashboard.route");
const productsRouter = require("./products.route");
const productsCategoryRouter = require("./products-category.route");

module.exports = (app) => {
  const PATCH_ADMIN = systemAdmin.prefitAdmin;
  app.use(PATCH_ADMIN + "/dashboard", dashboardRouter);
  app.use(PATCH_ADMIN + "/products", productsRouter);
  app.use(PATCH_ADMIN + "/products-category", productsCategoryRouter);
};
