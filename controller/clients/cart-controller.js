const Cart = require("../../models/cart.model");
const Products = require("../../models/products.model");
const productHelper = require("../../helpers/products");

// [GET] /cart
module.exports.index = async (req, res) => {
  const cartId = req.cookies.cartId;

  const cart = await Cart.findOne({ _id: cartId });

  if (cart.products.length > 0) {
    for (const item of cart.products) {
      const productInfo = await Products.findOne({
        _id: item.product_id,
      }).select("thumbnail title price discountPercentage slug");
      item.productInfo = productInfo;

      const newPrice = Math.round(
        (item.productInfo.price * (100 - item.productInfo.discountPercentage)) /
          100
      );
      item.newPrice = newPrice;

      const totalPrice = item.newPrice * item.quantity;
      item.totalPrice = totalPrice;
    }
  }

  cart.fullPrice = cart.products.reduce((sum, item) => {
    return sum + item.totalPrice;
  }, 0);

  console.log(cart);

  res.render("client/pages/cart/index", {
    pageTitle: "Giỏ hàng",
    cart: cart.products,
    fullPrice: cart.fullPrice,
  });
};

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
