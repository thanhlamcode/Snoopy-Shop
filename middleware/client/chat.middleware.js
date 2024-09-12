const RoomChat = require("../../models/room-chat.model");

module.exports.isAccess = async (req, res, next) => {
  try {
    console.log(res.locals.userInfo.id);
    console.log(req.params.roomChat);

    const roomChat = await RoomChat.findOne({
      _id: req.params.roomChat,
      deleted: false,
      "users.user_id": res.locals.userInfo.id,
    });

    if (roomChat) {
      next();
    } else {
      req.flash("error", "Bạn không có quyền xem mục này!");

      res.redirect("/");
    }
  } catch (error) {
    next(error);
  }
};
