const Chat = require("../../models/chat.model");
const uploadToCloudDinary = require("../../helpers/uploadCloudDinary");

module.exports = (res) => {
  const userId = res.locals.userInfo.id;
  const fullName = res.locals.userInfo.fullName;

  _io.once("connection", (socket) => {
    socket.on("CLIENT_SEND_MESSAGE", async (data) => {
      let images = [];

      for (const image of data.images) {
        const link = await uploadToCloudDinary(image);
        images.push(link);
      }

      console.log(images);

      const chat = new Chat({
        user_id: userId,
        content: data.content,
        images: images,
      });

      await chat.save();

      _io.emit("SERVER_RETURN_MESSAGE", {
        userId: userId,
        fullName: fullName,
        content: data.content,
        images: images,
      });

      // Server-side: Xử lý sự kiện typing từ client
      socket.on("CLIENT_SEND_TYPING", async (type) => {
        socket.broadcast.emit("SERVER_RETURN_TYPING", {
          userId: userId,
          fullName: fullName,
          type: type,
        });
      });
    });
  });
};
