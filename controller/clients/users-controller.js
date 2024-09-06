const User = require("../../models/users.model");
const usersSocket = require("../../socket/clients/users.socket");
const listFriendHelper = require("../../helpers/listFriend");

// [GET] /users/not-friend
module.exports.notFriend = async (req, res) => {
  const userId = res.locals.userInfo.id;

  // socket
  usersSocket(res);
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
  usersSocket(res);
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
  usersSocket(res);
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
  usersSocket(res);
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

  res.render("client/pages/users/list-friend", {
    pageTitle: "Danh sách bạn bè",
    user: user,
  });
};
