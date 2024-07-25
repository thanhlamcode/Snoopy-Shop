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
