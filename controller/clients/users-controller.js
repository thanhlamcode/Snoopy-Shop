const User = require("../../models/users.model");

// [GET] /users/not-friend
module.exports.notFriend = async (req, res) => {
  const userId = res.locals.userInfo.id;
  console.log(userId);

  const user = await User.find({
    _id: { $ne: userId },
    status: "active",
    deleted: false,
  });

  res.render("client/pages/users/not-friend", {
    pageTitle: "Danh sách người dùng",
    user: user,
  });
};
