const productsRouter = require("./products-routes");
const homeRouter = require("./home-routes");
const searchRouter = require("./search-routes");
const cartRouter = require("./cart-routes");
const blogRouter = require("./blog-routes");
const orderRouter = require("./order-routes");
const userRouter = require("./user-routes");
const categoryMiddleware = require("../../middleware/client/category.middleware");
const cartMiddleware = require("../../middleware/client/cart.middleware");
const userInfoMiddleware = require("../../middleware/client/user.middleware");

module.exports = (app) => {
  app.use(categoryMiddleware.category);
  app.use(categoryMiddleware.blogCategory);
  app.use(userInfoMiddleware.infoUser);

  app.use(cartMiddleware.cart);

  app.use("/", homeRouter);

  app.use("/products", productsRouter);

  app.use("/search", searchRouter);

  app.use("/cart", cartRouter);

  app.use("/blog", blogRouter);

  app.use("/order", orderRouter);

  app.use("/user", userRouter);
};
