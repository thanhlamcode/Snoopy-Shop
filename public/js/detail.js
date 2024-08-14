console.log("ok");

const stock = document.querySelector(".detail form input[name='quantity']");
const result = document.querySelector(".detail form .result");
const priceText = document.querySelector(".detail .new-price");

if (stock) {
  stock.addEventListener("change", () => {
    const quantity = parseInt(stock.value);
    const price = parseInt(priceText.innerHTML.slice(1));
    result.innerHTML = `$${price * quantity}`;
  });
}

document.addEventListener("DOMContentLoaded", function () {
  var logoutLink = document.getElementById("logout-link");

  logoutLink.addEventListener("click", function (event) {
    // Hiển thị hộp thoại xác nhận
    var confirmed = confirm("Bạn có chắc chắn muốn đăng xuất?");

    // Nếu người dùng chọn "Cancel", ngăn chặn hành động mặc định
    if (!confirmed) {
      event.preventDefault();
    }
  });
});
