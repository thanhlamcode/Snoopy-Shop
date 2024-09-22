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

// [GET] /users/addFriend/:id
module.exports.addFriend = async (req, res) => {
  try {
    const userId = res.locals.userInfo.id;
    const friendIdid = req.params.id;
    console.log(friendIdid);

    // Thêm friendId vào request của người gửi
    await User.updateOne(
      { _id: userId },
      {
        $push: {
          requestFriend: friendIdid,
        },
      }
    );

    // Thêm friendId vào request của người gửi
    await User.updateOne(
      { _id: friendIdid },
      {
        $push: {
          acceptFriend: userId,
        },
      }
    );

    // res.send("ok");

    req.flash("success", `Gửi lời mời kết bạn thành công !`);
    res.redirect("back");
  } catch (error) {
    req.flash("error", `Gửi lời mời thất bại !`);
    res.redirect("back");
  }
};

// [GET] /users/admin/:roomChat/:userId
module.exports.addAdmin = async (req, res) => {
  try {
    const roomChat = req.params.roomChatId;
    const userId = req.params.userId;

    console.log("roomChat:", roomChat);
    console.log("userId:", userId);

    await RoomChat.updateOne(
      { _id: roomChat, "users.user_id": userId }, // Tìm phòng chat và người dùng dựa trên user_id
      {
        $set: {
          "users.$.role": "superAdmin", // Cập nhật vai trò của người dùng được tìm thấy thành superAdmin
        },
      }
    );

    req.flash("success", `Cập nhập vai trò thành công !`);
    res.redirect("back");
  } catch (error) {
    req.flash("error", `Cập nhập vai trò thất bại !`);
    res.redirect("back");
  }
};

// [GET] /users/deleteMember/:roomChat/:userId
module.exports.deleteMember = async (req, res) => {
  try {
    const roomChat = req.params.roomChatId;
    const userId = req.params.userId;

    console.log("roomChat:", roomChat);
    console.log("userId:", userId);

    await RoomChat.updateOne(
      { _id: roomChat }, // Tìm phòng chat dựa trên roomChat
      {
        $pull: { users: { user_id: userId } }, // Xóa người dùng dựa trên user_id trong mảng users
      }
    );

    req.flash("success", `Xóa thành viên thành công!`);
    res.redirect("back");
  } catch (error) {
    req.flash("error", `Xóa thành viên thất bại!`);
    res.redirect("back");
  }
};
