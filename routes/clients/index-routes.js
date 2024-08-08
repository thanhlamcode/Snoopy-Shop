const productsRouter = require("./products-routes");
const homeRouter = require("./home-routes");
const searchRouter = require("./search-routes");
const categoryMiddleware = require("../../middleware/client/category.middleware");

module.exports = (app) => {
  app.use(categoryMiddleware.category);

  app.use("/", homeRouter);

  app.use("/products", productsRouter);

  app.use("/search", searchRouter);
};
