// CLIENT_SEND_MESSAGE
const formSendData = document.querySelector(".chat .inner-form");
formSendData.addEventListener("submit", (e) => {
  e.preventDefault();
  const content = e.target.elements.content.value;
  console.log(content);
  if (content) {
    socket.emit("CLIENT_SEND_MESSAGE", content);
    e.target.elements.content.value = "";
  }
});
// END CLIENT_SEND_MESSAGE

// SERVER_RETURN_MESSAGE
socket.on("SERVER_RETURN_MESSAGE", (data) => {
  console.log(data);
  const div = document.createElement("div");
  const chat = document.querySelector("[my-id]");
  const body = document.querySelector(".chat .inner-body");
  const id = chat.getAttribute("my-id");
  let htmlBody = "";

  if (data.userId == id) {
    div.classList.add("inner-outgoing");
  } else {
    div.classList.add("inner-incoming");
    htmlBody = `<div class="inner-name">${data.fullName}</div>`;
  }

  div.innerHTML = `
  ${htmlBody}
  <div class="inner-content">${data.content}</div>
  `;

  body.appendChild(div);
  body.scrollTop = body.scrollHeight;
});

// END SERVER_RETURN_MESSAGE

// CHAT SCROLL
const body = document.querySelector(".chat .inner-body");
if (body) {
  body.scrollTop = body.scrollHeight;
}
// END CHAT SCROLL
