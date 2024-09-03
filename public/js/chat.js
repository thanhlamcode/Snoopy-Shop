import * as Popper from "https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js";

const upload = new FileUploadWithPreview.FileUploadWithPreview("my-unique-id", {
  multiple: true,
  maxFileCount: 6,
});

// CLIENT_SEND_MESSAGE
const formSendData = document.querySelector(".chat .inner-form");
formSendData.addEventListener("submit", (e) => {
  e.preventDefault();
  const content = e.target.elements.content.value;
  const images = upload.cachedFileArray;
  console.log(images);

  if (content || images.length > 0) {
    socket.emit("CLIENT_SEND_MESSAGE", {
      content: content,
      images: images,
    });
    e.target.elements.content.value = "";
    upload.resetPreviewPanel(); // clear all selected images
    socket.emit("CLIENT_SEND_TYPING", "hidden");
  }
});
// END CLIENT_SEND_MESSAGE

// SERVER_RETURN_MESSAGE
socket.on("SERVER_RETURN_MESSAGE", (data) => {
  console.log(data);
  const div = document.createElement("div");
  const image = document.createElement("div");
  const chat = document.querySelector("[my-id]");
  const body = document.querySelector(".chat .inner-body");
  const id = chat.getAttribute("my-id");
  let htmlBody = "";
  let htmlContent = "";
  let htmlImages = "";

  image.classList.add("inner-images");

  if (data.userId == id) {
    image.classList.add("image-right");
  } else {
    image.classList.add("image-left");
  }

  if (data.userId == id) {
    div.classList.add("inner-outgoing");
  } else {
    div.classList.add("inner-incoming");
    htmlBody = `<div class="inner-name">${data.fullName}</div>`;
  }

  if (data.content) {
    htmlContent = ` <div class="inner-content">${data.content}</div>`;
  }

  if (data.images.length > 0) {
    htmlImages += `<div class="inner-images">`;

    for (const image of data.images) {
      htmlImages += `
      <img src=${image}>
      `;
    }

    htmlImages += `</div>`;
  }

  div.innerHTML = `
  ${htmlBody}
  ${htmlContent}
  `;

  image.innerHTML = `
  ${htmlImages}`;

  const listTyping = document.querySelector(".inner-list-typing");

  body.insertBefore(div, listTyping);
  body.insertBefore(image, listTyping);
  const gallery = new Viewer(image);
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

// show Typing

const showTyping = () => {
  let timeOut;
  socket.emit("CLIENT_SEND_TYPING", "show");

  clearTimeout(timeOut);

  timeOut = setTimeout(() => {
    socket.emit("CLIENT_SEND_TYPING", "hidden");
  }, 3000);
};

// end show Typing

// emoji to input
const emoji = document.querySelector("emoji-picker");
if (emoji) {
  emoji.addEventListener("emoji-click", (event) => {
    console.log(event.detail);
    const input = document.querySelector(".chat input[name='content']");
    input.value = input.value + event.detail.unicode;

    const end = input.value.length;
    input.setSelectionRange(end, end);
    input.focus();

    showTyping();
  });
}

// end emoji to input

// Client-side: Phát hiện người dùng đang gõ
const inputChat = document.querySelector(".chat input[name='content']");

inputChat.addEventListener("keyup", () => {
  showTyping();
});

const listTyping = document.querySelector(".inner-list-typing");
if (listTyping) {
  socket.on("SERVER_RETURN_TYPING", (data) => {
    if (data.type === "show") {
      // Sử dụng '===' để so sánh
      const existBox = document.querySelector(`[user-id="${data.userId}"]`);
      const body = document.querySelector(".chat .inner-body");

      if (!existBox) {
        let boxTyping = document.createElement("div");
        boxTyping.classList.add("box-typing");
        boxTyping.setAttribute("user-id", data.userId);
        boxTyping.innerHTML = `
            <div class="inner-name">${data.fullName}</div>
            <div class="inner-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
      `;
        listTyping.appendChild(boxTyping);
        body.scrollTop = body.scrollHeight;
      }
    } else {
      const existBox = document.querySelector(`[user-id="${data.userId}"]`);
      console.log(existBox);
      if (existBox) {
        // Kiểm tra nếu tồn tại trước khi xóa
        listTyping.removeChild(existBox);
      }
    }
  });
}

// viewer js
const bodyImage = document.querySelector(".chat .inner-body");
if (bodyImage) {
  const gallery = new Viewer(bodyImage);
}

// end viewer js
