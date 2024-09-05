const User = require("../../models/users.model");
const usersSocket = require("../../socket/clients/users.socket");

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

  console.log(userInfo);

  const user = await User.find({
    $and: [
      { _id: { $ne: userId } },
      {
        _id: { $nin: requestFriend },
      },
      {
        _id: { $nin: acceptFriend },
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
