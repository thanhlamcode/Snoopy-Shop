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

//CHANGE STATUS
const buttonChangeStatus = document.querySelectorAll("[button-change-status]");
const formChangeStatus = document.querySelector("#form-change-status");
if (formChangeStatus) {
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
}

//END CHANGE STATUS

// CHECKED
const checkBoxMulti = document.querySelector("[checkbox-multi]");
if (checkBoxMulti) {
  const checkAll = checkBoxMulti.querySelector("[name='checkall']");
  const checkItem = checkBoxMulti.querySelectorAll("[name='id']");

  if (checkAll) {
    checkAll.checked = false;
  }

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

  if (checkAll) {
    checkAll.addEventListener("click", () => {
      let isChecked = checkAll.checked;
      checkItem.forEach((item) => {
        item.checked = isChecked;
      });
    });
  }
}
// END CHECKED

// FORM CHANGE MULTI

const formChangeMulti = document.querySelector(".form-change-multi");
const type = document.querySelector("[name='type']");
if (formChangeMulti) {
  formChangeMulti.addEventListener("submit", (e) => {
    e.preventDefault();
    let checkItem = checkBoxMulti.querySelectorAll("[name='id']");
    console.log(type.value);
    let count = 0;
    checkItem.forEach((item) => {
      if (item.checked == true) {
        count++;
      }
    });

    if (count > 0) {
      const ids = [];
      checkItem.forEach((item) => {
        if (item.checked == true) {
          if (type.value == "change-position") {
            const position = item
              .closest("tr")
              .querySelector("[name='position']");
            ids.push(`${item.value}-${position.value}`);
          } else {
            ids.push(item.value);
          }
        }
      });
      const inputChange = formChangeMulti.querySelector("[name='ids']");
      inputChange.value = ids.join(",");

      formChangeMulti.submit();
    } else {
      alert("Vui lòng chọn ít nhất 1 bản ghi");
    }
  });
}

// END FORM CHANGE MULTI

// DELETE HARD
const buttonDelete = document.querySelectorAll("[button-delete]");
const formDeleteItem = document.querySelector("#form-delete-item");
const pathDelete = formDeleteItem.getAttribute("data-path");

if (buttonDelete) {
  buttonDelete.forEach((button) => {
    button.addEventListener("click", () => {
      if (confirm("Bạn có chắc chắn muốn xóa?")) {
        let id = button.getAttribute("id-delete");
        const action = pathDelete + "/" + id + "?_method=DELETE";
        console.log(action);
        formDeleteItem.action = action;
        formDeleteItem.submit();
      }
    });
  });
}

// END DELETE HARD
