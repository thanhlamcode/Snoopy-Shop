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
