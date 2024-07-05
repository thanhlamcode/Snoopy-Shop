//CHANGE STATUS
const buttonChangeStatus = document.querySelectorAll("[button-change-status]");
const formChangeStatus = document.querySelector("#form-change-status");
const path = formChangeStatus.getAttribute("data-path");

if (buttonChangeStatus.length > 0) {
  buttonChangeStatus.forEach((button) => {
    button.addEventListener("click", () => {
      const status = button.getAttribute("data-status");
      const id = button.getAttribute("data-id");
      const statusChange = status == "active" ? "unactive" : "active";

      let action = path + `/${statusChange}/${id}?_method=PATCH`;
      formChangeStatus.action = action;

      formChangeStatus.submit();
    });
  });
}

//END CHANGE STATUS

// CHECKED
const checkBoxMulti = document.querySelector("[checkbox-multi]");
const checkAll = checkBoxMulti.querySelector("[name='checkall']");
const checkItem = checkBoxMulti.querySelectorAll("[name='id']");

checkAll.checked = false;

checkItem.forEach((item) => {
  item.addEventListener("click", updateCheckAll);
});

function updateCheckAll() {
  let allChecked = true;
  checkItem.forEach((item) => {
    if (!item.checked) {
      allChecked = false;
    }
  });
  checkAll.checked = allChecked;
}

checkAll.addEventListener("click", () => {
  let isChecked = checkAll.checked;
  checkItem.forEach((item) => {
    item.checked = isChecked;
  });
});

// END CHECKED

// FORM CHANGE MULTI

const formChangeMulti = document.querySelector(".form-change-multi");

formChangeMulti.addEventListener("submit", (e) => {
  e.preventDefault();
  const ids = [];
  // console.log(e);
  let checkItem = checkBoxMulti.querySelectorAll("[name='id']");
  checkItem.forEach((item) => {
    if (item.checked == true) {
      ids.push(item.value);
    }
  });
  // console.log(ids);
  const inputChange = formChangeMulti.querySelector("[name='ids']");
  inputChange.value = ids.join(",");
  // console.log(inputChange.value);
  formChangeMulti.submit();
});

// END FORM CHANGE MULTI
