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

// [GET] /chat/chatGroup/setting/:id
module.exports.chatSetting = async (req, res) => {
  const userId = res.locals.userInfo.id;
  const idGroupChat = req.params.id;

  const user = await User.findOne({ _id: userId });
  const roomChat = await RoomChat.findOne({ deleted: false, _id: idGroupChat });

  let peopleInGroupChat = [];
  let friendList = [];

  // Lấy ra thông tin của thành viên
  for (const item of roomChat.users) {
    const userItem = await User.findOne({
      deleted: false,
      _id: item.user_id,
    });

    peopleInGroupChat.push(item.user_id);

    item.info = userItem;
    // Kiểm tra nếu userId có trong friendList
    const isFriend = userItem.friendList.find(
      (friend) => friend.user_id === userId
    );

    if (isFriend) {
      item.addFriend = true;
      item.roomChatId = isFriend.room_chat_id;
    }

    const requestFriend = user.requestFriend.some(
      (request) => request == item.user_id
    );

    // console.log(requestFriend);
    item.request = requestFriend;
  }

  // Lấy ra danh sách bạn bè
  for (const item of user.friendList) {
    friendList.push(item.user_id);
  }

  for (const item of user.friendList) {
    const info = await User.findOne({ _id: item.user_id });

    item.fullName = info.fullName;
  }

  // console.log("Danh sách thành viên nhóm chat: " + peopleInGroupChat);
  // console.log("Danh sách bạn bè: " + friendList);

  // Lấy ra bạn bè nhưng không nằm trong đoạn chat
  const filteredFriends = friendList.filter(
    (friendId) => !peopleInGroupChat.includes(friendId)
  );

  let listCanIn = [];

  // console.log(filteredFriends);

  for (const item of filteredFriends) {
    const peopleOtherChat = await User.findOne({ _id: item });
    listCanIn.push(peopleOtherChat);
  }

  // console.log(listCanIn);
  const isAdmin = await RoomChat.findOne({
    typeRoom: "group",
    users: {
      $elemMatch: {
        user_id: userId,
        role: "superAdmin",
      },
    },
  });

  // console.log(user.friendList);
  let friendListId = [];

  user.friendList.forEach((item) => {
    friendListId.push(item.user_id);
  });

  // console.log(friendListId);

  res.render("client/pages/chat/chatSetting", {
    pageTitle: "Cài đặt chung phòng chat",
    member: roomChat.users, // Thành viên trong đoạn chat
    roomChat: roomChat,
    listCanIn: listCanIn,
    isAdmin: isAdmin,
    friendListId: friendListId,
  });
};

// [POST] /chat/chatGroup/addMember/:roomChatId
module.exports.chatSettingAddMember = async (req, res) => {
  try {
    const room_chat_id = req.params.roomChatId;

    const ids = req.body.ids.split(",");
    console.log(room_chat_id);

    for (const item of ids) {
      await RoomChat.updateOne(
        { _id: room_chat_id },
        {
          $push: {
            users: {
              user_id: item,
              role: "user",
            },
          },
        }
      );
    }
    req.flash("success", "Thêm thành viên mới thành công!");
    res.redirect("back");
  } catch (error) {
    req.flash("error", "Thêm thành viên mới thất bại!");
    res.redirect("back");
  }
};

// [POST] /chat/chatGroup/setting/:roomChatId
module.exports.updateInfoChat = async (req, res) => {
  console.log(req.body);
  const roomChatId = req.params.roomChatId;
  console.log(roomChatId);

  await RoomChat.updateOne(
    { _id: roomChatId },
    {
      title: req.body.title,
      thumbnail: req.body.thumbnail,
    }
  );

  req.flash("success", "Cập nhập thông tin nhóm chat thành công!");
  res.redirect("back");
};
