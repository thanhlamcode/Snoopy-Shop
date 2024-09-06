console.log("ok");

// Gửi và xóa lời mời kết bạn
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
      const id = item.getAttribute("button-cancel");
      console.log(id);
      const boxUser = item.closest(".box-user");
      console.log(boxUser);

      if (boxUser.classList.contains("add")) {
        boxUser.classList.remove("add");
      } else {
        boxUser.classList.add("add");
      }

      socket.emit("CLIENT_CANCEL_FRIEND", id);
    });
  });
}

// Xử lý trang Chấp nhận kết bạn
const btnAcceptFriend = document.querySelectorAll("[btn-add-friend-accept]");
const btnDeclineFriend = document.querySelectorAll(
  "[btn-cancel-friend-accept]"
);
const acceptBtn = document.querySelectorAll(".accept");
const declineBtn = document.querySelectorAll(".decline");

if (btnAcceptFriend.length > 0) {
  btnAcceptFriend.forEach((item, index) => {
    item.addEventListener("click", () => {
      const id = item.getAttribute("button-add");

      const wrapbtn = item.closest(".inner-buttons");
      wrapbtn.classList.add("none");
      acceptBtn[index].classList.add("display");

      socket.emit("CLIENT_SEND_ACCEPT", id);
      console.log("Gửi thành công!");
    });
  });
}

if (btnDeclineFriend.length > 0) {
  btnDeclineFriend.forEach((item, index) => {
    item.addEventListener("click", () => {
      const id = item.getAttribute("button-cancel");

      const wrapbtn = item.closest(".inner-buttons");
      wrapbtn.classList.add("none");
      declineBtn[index].classList.add("display");

      socket.emit("CLIENT_SEND_DECLINE", id);
    });
  });
}
