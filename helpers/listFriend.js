module.exports.listFriend = (userInfo) => {
  let friendList = [];

  userInfo.friendList.forEach((item) => {
    friendList.push(item.user_id);
  });

  return friendList;
};
