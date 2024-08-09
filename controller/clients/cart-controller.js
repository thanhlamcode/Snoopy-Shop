const Cart = require("../../models/cart.model");
const productHelper = require("../../helpers/products");

// [POST] /cart/add/:product
module.exports.addPost = async (req, res) => {
  const idProduct = req.params.product;
  const cartId = req.cookies.cartId;
  const quantity = parseInt(req.body.quantity);
  // console.log(idProduct);
  // console.log(cartId);
  // console.log(quantity);

  const cart = await Cart.findOne({ _id: cartId });
  const products = cart.products;

  const existProduct = products.find((item) => item.product_id == idProduct);
  if (existProduct) {
    const newQuantity = quantity + existProduct.quantity;
    console.log(newQuantity);
    await Cart.updateOne(
      { _id: cartId, "products.product_id": idProduct },
      {
        $set: {
          "products.$.quantity": newQuantity,
        },
      }
    );
  } else {
    await Cart.updateOne(
      { _id: cartId },
      {
        $push: {
          products: {
            product_id: idProduct,
            quantity: quantity,
          },
        },
      }
    );
  }

  req.flash("success", `Thêm ${quantity} sản phẩm vào giỏ hàng thành công !`);
  res.redirect("back");
};
