module.exports.products = (products) => {
  products.forEach((item) => {
    const newPrice = Math.round(
      (item.price * (100 - item.discountPercentage)) / 100
    );
    item.newPrice = newPrice;
    const discountPrice = item.price - item.newPrice;
    item.discountPrice = discountPrice;
  });
};
