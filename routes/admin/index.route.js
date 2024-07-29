const systemAdmin = require("../../config/systems");
const dashboardRouter = require("./dashboard.route");
const productsRouter = require("./products.route");
const productsCategoryRouter = require("./products-category.route");
const roleRouter = require("./roles.route");
const accountsRouter = require("./accounts.route");
const myaccountRouter = require("./my-account.route");
const authRouter = require("./auth.route");
const authMiddleware = require("../../middleware/admin/require.middleware");

module.exports = (app) => {
  const PATCH_ADMIN = systemAdmin.prefitAdmin;
  app.use(
    PATCH_ADMIN + "/dashboard",
    authMiddleware.requireAuth,
    dashboardRouter
  );
  app.use(
    PATCH_ADMIN + "/products",
    authMiddleware.requireAuth,
    productsRouter
  );
  app.use(
    PATCH_ADMIN + "/products-category",
    authMiddleware.requireAuth,
    productsCategoryRouter
  );
  app.use(PATCH_ADMIN + "/roles", authMiddleware.requireAuth, roleRouter);
  app.use(
    PATCH_ADMIN + "/accounts",
    authMiddleware.requireAuth,
    accountsRouter
  );
  app.use(
    PATCH_ADMIN + "/my-account",
    authMiddleware.requireAuth,
    myaccountRouter
  );
  app.use(PATCH_ADMIN + "/auth", authRouter);
};
