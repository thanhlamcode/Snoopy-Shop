const productsRouter = require("./products-routes");
const homeRouter = require("./home-routes");

module.exports = (app) => {
  app.use("/", homeRouter);

  app.use("/products", productsRouter);
};
