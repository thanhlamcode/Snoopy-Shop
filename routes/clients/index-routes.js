const productsRouter = require("./products-routes");
const homeRouter = require("./home-routes");
const searchRouter = require("./search-routes");
const cartRouter = require("./cart-routes");
const blogRouter = require("./blog-routes");
const categoryMiddleware = require("../../middleware/client/category.middleware");
const cartMiddleware = require("../../middleware/client/cart.middleware");

module.exports = (app) => {
  app.use(categoryMiddleware.category);

  app.use(cartMiddleware.cart);

  app.use("/", homeRouter);

  app.use("/products", productsRouter);

  app.use("/search", searchRouter);

  app.use("/cart", cartRouter);

  app.use("/blog", blogRouter);
};
