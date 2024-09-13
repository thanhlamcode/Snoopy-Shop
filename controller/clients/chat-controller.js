const Chat = require("../../models/chat.model");
const RoomChat = require("../../models/room-chat.model");
const User = require("../../models/users.model");
const chatSocket = require("../../socket/clients/chat.socket");
const chatGroupSocket = require("../../socket/clients/chatGroup.socket");
const chatGroupMultiSocket = require("../../socket/clients/chatGroupMulti.socket");

// [GET] /chat
module.exports.index = async (req, res) => {
  //socket
  chatSocket(res);
  //end socket

  const chats = await Chat.find({ deleted: false, room_chat_id: "public" });

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

// [GET] /chat/:roomChat
module.exports.roomChat = async (req, res) => {
  //socket
  chatGroupSocket(req, res);
  //end socket

  const roomChat = req.params.roomChat;
  // console.log(roomChat);

  const chats = await Chat.find({ deleted: false, room_chat_id: roomChat });

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

// [GET] /chat/chatGroup/:id
module.exports.chatGroup = async (req, res) => {
  //socket
  chatGroupMultiSocket(req, res);
  //end socket

  const idGroupChat = req.params.id;
  // console.log(roomChat);

  const chats = await Chat.find({ deleted: false, room_chat_id: idGroupChat });

  const roomChat = await RoomChat.findOne({ deleted: false, _id: idGroupChat });

  for (const item of chats) {
    const userInfo = await User.findOne({
      _id: item.user_id,
    });

    item.userInfo = userInfo;
  }

  res.render("client/pages/chat/chatGroup", {
    pageTitle: "Chat",
    chats: chats,
    nameRoomChat: roomChat.title,
    roomChatId: roomChat.id,
  });
};

// [GET] /chat/chatGroup/:id
module.exports.chatSetting = async (req, res) => {
  const userId = res.locals.userInfo.id;
  const idGroupChat = req.params.id;

  const user = await User.findOne({ _id: userId });
  const roomChat = await RoomChat.findOne({ deleted: false, _id: idGroupChat });

  for (const item of roomChat.users) {
    const userItem = await User.findOne({
      deleted: false,
      _id: item.user_id,
    });

    item.info = userItem;
  }

  console.log(roomChat.users);

  for (const item of user.friendList) {
    const info = await User.findOne({ _id: item.user_id });

    item.fullName = info.fullName;
  }

  res.render("client/pages/chat/chatSetting", {
    pageTitle: "Cài đặt chung phòng chat",
    member: roomChat.users,
    roomChat: roomChat,
  });
};
