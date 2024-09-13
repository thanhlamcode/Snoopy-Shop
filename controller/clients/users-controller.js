const User = require("../../models/users.model");
const RoomChat = require("../../models/room-chat.model");
const usersSocket = require("../../socket/clients/users.socket");
const listFriendHelper = require("../../helpers/listFriend");

// [GET] /users/not-friend
module.exports.notFriend = async (req, res) => {
  const userId = res.locals.userInfo.id;

  // socket
  usersSocket(req, res);
  // end socket

  const userInfo = await User.findOne({
    _id: userId,
  });

  const requestFriend = userInfo.requestFriend;
  const acceptFriend = userInfo.acceptFriend;

  const friendList = listFriendHelper.listFriend(userInfo);
  // console.log(userInfo);

  const user = await User.find({
    $and: [
      { _id: { $ne: userId } },
      {
        _id: { $nin: requestFriend },
      },
      {
        _id: { $nin: acceptFriend },
      },
      {
        _id: { $nin: friendList },
      },
    ],
    status: "active",
    deleted: false,
  });

  res.render("client/pages/users/not-friend", {
    pageTitle: "Danh sách người dùng",
    user: user,
  });
};

// [GET] /users/request
module.exports.request = async (req, res) => {
  const userId = res.locals.userInfo.id;

  // socket
  usersSocket(req, res);
  // end socket

  const userInfo = await User.findOne({
    _id: userId,
  });

  const requestFriend = userInfo.requestFriend;

  const user = await User.find({
    _id: { $in: requestFriend },
    status: "active",
    deleted: false,
  });

  res.render("client/pages/users/request", {
    pageTitle: "Lời mời đã gửi",
    user: user,
  });
};

// [GET] /users/accept
module.exports.accept = async (req, res) => {
  const userId = res.locals.userInfo.id;

  // socket
  usersSocket(req, res);
  // end socket

  const userInfo = await User.findOne({
    _id: userId,
  });

  const acceptFriend = userInfo.acceptFriend;

  const user = await User.find({
    _id: { $in: acceptFriend },
    status: "active",
    deleted: false,
  });

  res.render("client/pages/users/accept", {
    pageTitle: "Lời mời kết bạn",
    user: user,
  });
};

// [GET] /users/list-friend
module.exports.listFriend = async (req, res) => {
  const userId = res.locals.userInfo.id;

  // socket
  usersSocket(req, res);
  // end socket

  const userInfo = await User.findOne({
    _id: userId,
  });

  const friendList = listFriendHelper.listFriend(userInfo);

  const user = await User.find({
    _id: { $in: friendList },
    status: "active",
    deleted: false,
  });

  for (const item of user) {
    const friend = item.friendList.find((object) => object.user_id === userId);
    if (friend) {
      item.room_chat_id = friend.room_chat_id;
    }
  }

  res.render("client/pages/users/list-friend", {
    pageTitle: "Danh sách bạn bè",
    user: user,
  });
};

// [GET] /users/room-chat
module.exports.roomChat = async (req, res) => {
  const userId = res.locals.userInfo.id;

  // socket
  usersSocket(req, res);
  // end socket

  const roomChat = await RoomChat.find({
    typeRoom: "group",
    "users.user_id": userId,
  });

  // console.log(roomChat);

  res.render("client/pages/users/room-chat", {
    pageTitle: "Nhóm chat",
    roomChat: roomChat,
  });
};

// [GET] /users/create-room-chat
module.exports.createRoomChat = async (req, res) => {
  const userId = res.locals.userInfo.id;

  // socket
  usersSocket(req, res);
  // end socket

  const user = await User.findOne({ _id: userId });

  for (const item of user.friendList) {
    const info = await User.findOne({ _id: item.user_id });

    item.fullName = info.fullName;
  }

  res.render("client/pages/users/create-room-chat", {
    pageTitle: "Tạo phòng chat mới",
    friendList: user.friendList,
  });
};

// [POST] /users/create-room-chat
module.exports.postCreateRoomChat = async (req, res) => {
  try {
    const user_id = res.locals.userInfo.id;

    let users = [];

    users.push({
      user_id: user_id,
      role: "superAdmin",
    });

    req.body.users.forEach((item) => {
      users.push({
        user_id: item,
        role: "user",
      });
    });

    req.body.users = users;
    req.body.status = "active";
    req.body.typeRoom = "group";

    const roomChat = new RoomChat(req.body);
    await roomChat.save();

    console.log(req.body);

    req.flash("success", `Tạo phòng chat mới thành công !`);
    res.redirect("/users/room-chat");
  } catch (error) {
    req.flash("error", `Tạo phòng chat mới thất bại !`);
    res.redirect("/users/room-chat");
  }
};
