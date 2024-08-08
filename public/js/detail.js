console.log("ok");

const stock = document.querySelector(".detail form input[name='quantity']");
const result = document.querySelector(".detail form .result");
const priceText = document.querySelector(".detail .new-price");

stock.addEventListener("change", () => {
  const quantity = parseInt(stock.value);
  const price = parseInt(priceText.innerHTML.slice(1));
  result.innerHTML = `$${price * quantity}`;
});
