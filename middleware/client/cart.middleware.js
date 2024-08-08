const Cart = require("../../models/cart.model");

module.exports.cart = async (req, res, next) => {
  try {
    if (!req.cookies.cartId) {
      const cart = new Cart();
      await cart.save();

      const expires = 1000 * 60 * 60 * 24 * 365;

      res.cookie("cartId", cart.id, {
        expires: new Date(Date.now() + expires),
      });
    } else {
    }

    next();
  } catch (error) {
    next(error);
  }
};
