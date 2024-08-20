import * as Popper from "https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js";

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

// EMOJI
const button = document.querySelector(".button-icon");
if (button) {
  console.log("vào emoji");
  const tooltip = document.querySelector(".tooltip");
  Popper.createPopper(button, tooltip);

  button.onclick = () => {
    tooltip.classList.toggle("shown");
  };
}
//END EMOJI

// emoji to input
const emoji = document.querySelector("emoji-picker");
if (emoji) {
  emoji.addEventListener("emoji-click", (event) => {
    console.log(event.detail);
    const input = document.querySelector(".chat input[name='content']");
    input.value = input.value + event.detail.unicode;
  });
}

// end emoji to input
