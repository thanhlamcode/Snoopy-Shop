const Chat = require("../../models/chat.model");
const uploadToCloudDinary = require("../../helpers/uploadCloudDinary");

module.exports = (req, res) => {
  const userId = res.locals.userInfo.id;
  const fullName = res.locals.userInfo.fullName;

  const roomChatId = req.params.roomChat;

  _io.once("connection", (socket) => {
    socket.join(roomChatId);
    socket.on("CLIENT_SEND_MESSAGE", async (data) => {
      let images = [];

      for (const image of data.images) {
        const link = await uploadToCloudDinary(image);
        images.push(link);
      }

      // console.log(images);

      const chat = new Chat({
        user_id: userId,
        content: data.content,
        images: images,
        room_chat_id: roomChatId,
      });

      await chat.save();

      _io.to(roomChatId).emit("SERVER_RETURN_MESSAGE", {
        userId: userId,
        fullName: fullName,
        content: data.content,
        images: images,
      });

      // Server-side: Xử lý sự kiện typing từ client
      socket.on("CLIENT_SEND_TYPING", async (type) => {
        socket.broadcast.to(roomChatId).emit("SERVER_RETURN_TYPING", {
          userId: userId,
          fullName: fullName,
          type: type,
        });
      });
    });
  });
};
