console.log("ok");

const btnAddFriend = document.querySelectorAll("[btn-add-friend]");
const btnCancelFriend = document.querySelectorAll("[btn-cancel-friend]");

if (btnAddFriend.length > 0) {
  btnAddFriend.forEach((item) => {
    item.addEventListener("click", () => {
      const id = item.getAttribute("button-add");
      console.log(id);
      const boxUser = item.closest(".box-user");
      console.log(boxUser);

      if (boxUser.classList.contains("add")) {
        boxUser.classList.remove("add");
      } else {
        boxUser.classList.add("add");
      }

      socket.emit("CLIENT_ADD_FRIEND", id);
    });
  });
}

if (btnCancelFriend.length > 0) {
  btnCancelFriend.forEach((item) => {
    item.addEventListener("click", () => {
      const id = item.getAttribute("button-add");
      console.log(id);
      const boxUser = item.closest(".box-user");
      console.log(boxUser);

      if (boxUser.classList.contains("add")) {
        boxUser.classList.remove("add");
      } else {
        boxUser.classList.add("add");
      }
    });
  });
}
