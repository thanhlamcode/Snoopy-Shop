const Cart = require("../../models/cart.model");

module.exports.cart = async (req, res, next) => {
  try {
    if (!req.cookies.cartId) {
      const cart = new Cart();
      await cart.save();

      const expires = 1000 * 60 * 60 * 24 * 365;

      res.cookies("cartId", cart, { expires: new Date(Date.now() + expires) });

      // console.log(req.cookies.cartId);
    } else {
      // console.log(req.cookies.cartId);
    }

    next();
  } catch (error) {
    next(error);
  }
};
