//ALERT

const showModal = document.querySelector("[show-alert]");
// console.log(showModal);

if (showModal) {
  setTimeout(() => {
    showModal.classList.add("alert-hidden");
  }, 5000);

  const closeAlert = showModal.querySelector(".close-alert");
  if (closeAlert) {
    closeAlert.addEventListener("click", () => {
      showModal.classList.add("alert-hidden");
    });
  }
}

//END ALERT

// UPDATE PRICE
const tableCart = document.querySelector(".cart table");

if (tableCart) {
  const inputQuantity = document.querySelectorAll("tbody td input");
  const newPrice = document.querySelectorAll("tbody td[newPrice]");
  const totalPrice = document.querySelectorAll("tbody td[totalPrice]");
  const fullPrice = document.querySelector("h3[fullPrice]");

  // tính thuộc tính totalPrice
  totalPrice.forEach((item, index) => {
    const result =
      parseInt(inputQuantity[index].value) *
      parseInt(newPrice[index].getAttribute("newprice"));
    totalPrice[index].innerHTML = `${result}$`;
    totalPrice[index].setAttribute("totalPrice", result);
  });

  inputQuantity.forEach((item, index) => {
    item.addEventListener("change", () => {
      const result =
        parseInt(inputQuantity[index].value) *
        parseInt(newPrice[index].getAttribute("newprice"));
      // console.log(result);

      totalPrice[index].innerHTML = `${result}$`;
      totalPrice[index].setAttribute("totalPrice", result);

      let sum = 0;

      for (const item of totalPrice) {
        sum += parseInt(item.getAttribute("totalPrice"));
      }
      // console.log(sum);

      fullPrice.innerHTML = `Tổng đơn hàng: ${sum}$`;
    });
  });
}

// END UPDATE PRICE
