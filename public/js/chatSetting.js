const modalBody = document.querySelector(".modal-body");

const input = modalBody.querySelectorAll("input");
const formAddMember = document.querySelector("#form-add-member");
const inputAdd = formAddMember.querySelector("input");
const btnSubmit = document.querySelector("#btn-submit-add");

let selectedIds = []; // Mảng để lưu trữ các ID đã chọn

input.forEach((item) => {
  item.addEventListener("change", () => {
    const id = item.getAttribute("data-id");

    if (item.checked) {
      // Nếu ô được chọn, thêm ID vào mảng
      if (!selectedIds.includes(id)) {
        selectedIds.push(id);
      }
    } else {
      // Nếu ô bị bỏ chọn, xóa ID khỏi mảng
      const index = selectedIds.indexOf(id);
      if (index > -1) {
        selectedIds.splice(index, 1);
      }
    }

    // Cập nhật giá trị inputAdd bằng các ID đã chọn, nối với dấu phẩy
    inputAdd.value = selectedIds.join(",");
  });
});

btnSubmit.addEventListener("click", () => {
  if (inputAdd.value != "") {
    formAddMember.submit();
  }
});
