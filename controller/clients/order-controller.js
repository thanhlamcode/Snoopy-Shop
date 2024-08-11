const Cart = require("../../models/cart.model");
const Products = require("../../models/products.model");
const productHelper = require("../../helpers/products");

// [GET] /cart
module.exports.index = async (req, res) => {
  const info = JSON.parse(req.body.info);
  console.log(info);

  const cartId = req.cookies.cartId;

  for (const item of info) {
    await Cart.updateOne(
      { _id: cartId, "products.product_id": item.product_id },
      {
        $set: {
          "products.$.quantity": item.quantity,
        },
      }
    );
  }

  req.flash("success", `Cập nhập giỏ hàng thành công !`);
  res.redirect("back");
};
