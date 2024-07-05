// RESTORE ONE ITEM
const formRestore = document.querySelector("#form-restore");
// console.log(formRestore);
const buttonRestore = document.querySelectorAll("[id-restore]");
console.log(buttonRestore);

buttonRestore.forEach((button) => {
  button.addEventListener("click", () => {
    const path = formRestore.getAttribute("path");
    const id = button.getAttribute("id-restore");

    const action = `${path}/${id}?_method=PATCH`;
    formRestore.action = action;
    formRestore.submit();
  });
});

// END RESTORE ONE ITEM
