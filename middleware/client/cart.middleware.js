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
      const cart = await Cart.findOne({ _id: req.cookies.cartId });
      // console.log(cart.products);

      const totalQuantity = cart.products.reduce(
        (total, product) => total + product.quantity,
        0
      );
      // console.log(`Total Quantity: ${totalQuantity}`);

      res.locals.totalQuantity = totalQuantity;
    }

    next();
  } catch (error) {
    next(error);
  }
};
