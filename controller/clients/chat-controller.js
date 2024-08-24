const Chat = require("../../models/chat.model");
const User = require("../../models/users.model");
const chatSocket = require("../../socket/clients/chat.socket");

// [GET] /chat
module.exports.index = async (req, res) => {
  //socket
  chatSocket(res);
  //end socket

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
