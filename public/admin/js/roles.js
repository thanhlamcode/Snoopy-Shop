// PERMISSION
const tablePermission = document.querySelector("table");

if (tablePermission) {
  const rows = tablePermission.querySelectorAll("[data-name]");
  const buttonSubmit = document.querySelector("[button-submit]");
  const formChangePermission = document.querySelector(
    "#form-change-permissions"
  );
  const inputForm = document.querySelector("[name='permissions']");

  buttonSubmit.addEventListener("click", () => {
    let permissions = [];

    rows.forEach((row) => {
      const name = row.getAttribute("data-name");
      const inputs = row.querySelectorAll("input");

      if (name == "id") {
        inputs.forEach((input) => {
          permissions.push({
            id: input.value,
            permissions: [],
          });
        });
      } else {
        inputs.forEach((input, index) => {
          const checked = input.checked;
          if (checked) {
            permissions[index].permissions.push(name);
          }
        });
      }
    });

    inputForm.value = JSON.stringify(permissions);
    formChangePermission.submit();

    console.log(permissions);
  });
}

// END PERMISSION

//CHECKALL
const checkAll = document.querySelectorAll(".checkall");

checkAll.forEach((checkAllItem, index) => {
  checkAllItem.addEventListener("change", () => {
    const permissionRows = document.querySelectorAll(`tr[data-name]`);

    permissionRows.forEach((row) => {
      const checkbox = row.querySelectorAll("input[type='checkbox']");

      checkbox.forEach((checkboxItem, indexCheck) => {
        const name = checkboxItem.getAttribute("data-name");
        if (name != "id" && index == indexCheck) {
          checkboxItem.checked = checkAllItem.checked;
        }
      });

      checkbox.forEach((checkboxItem, indexCheck) => {
        const name = checkboxItem.getAttribute("data-name");
        checkboxItem.addEventListener("change", () => {
          checkAllItem.checked = true;
          if (
            name != "id" &&
            index == indexCheck &&
            checkboxItem.checked == false
          ) {
            checkAllItem.checked = false;
          }
        });
      });
    });
  });
});

//END CHECKALL
