// RESTORE ONE ITEM
const formRestore = document.querySelector("#form-restore");
// console.log(formRestore);
const buttonRestore = document.querySelectorAll("[id-restore]");
// console.log(buttonRestore);

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

//RESTORE MANY
const inputRestore = document.querySelector("[name='ids']");
const formRestoreMulti = document.querySelector(".form-restore-multi");
const checkBox = document.querySelectorAll("[name='id']");
console.log(formRestoreMulti);
const ids = [];

formRestoreMulti.addEventListener("submit", (e) => {
  e.preventDefault();
  checkBox.forEach((item) => {
    if (item.checked == true) {
      ids.push(item.value);
    }
  });
  inputRestore.value = ids.join(",");

  console.log(inputRestore.value);
  formRestoreMulti.submit();
});

// END RESTORE MANY
