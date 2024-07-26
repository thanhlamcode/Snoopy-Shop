const systemAdmin = require("../../config/systems");
const dashboardRouter = require("./dashboard.route");
const productsRouter = require("./products.route");
const productsCategoryRouter = require("./products-category.route");
const roleRouter = require("./roles.route");
const accountsRouter = require("./accounts.route");

module.exports = (app) => {
  const PATCH_ADMIN = systemAdmin.prefitAdmin;
  app.use(PATCH_ADMIN + "/dashboard", dashboardRouter);
  app.use(PATCH_ADMIN + "/products", productsRouter);
  app.use(PATCH_ADMIN + "/products-category", productsCategoryRouter);
  app.use(PATCH_ADMIN + "/roles", roleRouter);
  app.use(PATCH_ADMIN + "/accounts", accountsRouter);
};
