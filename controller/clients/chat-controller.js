const Chat = require("../../models/chat.model");
const User = require("../../models/users.model");

// [GET] /chat
module.exports.index = async (req, res) => {
  const userId = res.locals.userInfo.id;

  _io.once("connection", (socket) => {
    socket.on("CLIENT_SEND_MESSAGE", async (content) => {
      const chat = new Chat({
        user_id: userId,
        content: content,
      });

      await chat.save();
    });
  });

  const chats = await Chat.find({});

  for (const item of chats) {
    const userInfo = await User.findOne({
      _id: item.user_id,
    });

    item.userInfo = userInfo;
  }

  res.render("client/pages/chat/index", {
    pageTitle: "Chat",
    chats: chats,
  });
};
