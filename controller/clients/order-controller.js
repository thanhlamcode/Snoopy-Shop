const Cart = require("../../models/cart.model");
const Products = require("../../models/products.model");
const Order = require("../../models/order.model");
const productHelper = require("../../helpers/products");

// [POST] /order
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

  // req.flash("success", `Cập nhập giỏ hàng thành công !`);
  res.redirect("/order/checkout");
};

// [GET] /order/checkOut
module.exports.checkOut = async (req, res) => {
  const cartId = req.cookies.cartId;

  const cart = await Cart.findOne({ _id: cartId });

  if (cart.products.length > 0) {
    for (const item of cart.products) {
      const productInfo = await Products.findOne({
        _id: item.product_id,
      }).select("thumbnail title price discountPercentage slug stock");
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

  // console.log(cart);

  res.render("client/pages/checkout/index", {
    pageTitle: "Thanh toán",
    cart: cart.products,
    fullPrice: cart.fullPrice,
  });
};

// [POST] /order/payment
module.exports.payment = async (req, res) => {
  const cartId = req.cookies.cartId;

  const cart = await Cart.findOne({ _id: cartId });
  let products = [];

  const userInfo = req.body;
  let objectOrder = {};
  for (const item of cart.products) {
    objectOrder = {
      product_id: item.product_id,
      quantity: item.quantity,
      price: 0,
      discountPercentage: 0,
    };

    const productInfo = await Products.findOne({
      _id: item.product_id,
    }).select("price discountPercentage");

    objectOrder.price = productInfo.price;
    objectOrder.discountPercentage = productInfo.discountPercentage;

    products.push(objectOrder);
  }

  const record = new Order({
    userInfo: userInfo,
    cart_id: cartId,
    products: products,
  });

  console.log(record);
  console.log(record.id);
  record.save();
  await Cart.updateOne({ _id: cartId }, { products: [] });
  res.redirect(`/order/success/${record.id}`);
};

// [GET] /order/success
module.exports.success = async (req, res) => {
  const orderId = req.params.id;
  console.log(orderId);

  const order = await Order.findOne({ _id: orderId });

  for (const item of order.products) {
    const product = await Products.findOne({ _id: item.product_id });
    item.thumbnail = product.thumbnail;
    item.title = product.title;

    // Tính tổng tiền từng loại sản phẩm
    const newPrice = Math.round(
      (item.price * (100 - item.discountPercentage)) / 100
    );
    item.newPrice = newPrice;

    const totalPrice = item.newPrice * item.quantity;
    item.totalPrice = totalPrice;
    //end
  }

  order.fullPrice = order.products.reduce((sum, item) => {
    return sum + item.totalPrice;
  }, 0);

  console.log(order);

  res.render("client/pages/order/success", {
    pageTitle: "Đặt hàng thành công",
    order: order,
  });
};
