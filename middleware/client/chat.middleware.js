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

module.exports.isAccessGroup = async (req, res, next) => {
  try {
    // console.log(res.locals.userInfo.id);
    // console.log(req.params.id);

    const roomChat = await RoomChat.findOne({
      _id: req.params.id,
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

module.exports.isAdminAccess = async (req, res, next) => {
  try {
    // Tìm room chat với điều kiện user đang tồn tại trong danh sách users
    const roomChat = await RoomChat.findOne({
      _id: req.params.roomChatId,
      deleted: false,
      "users.user_id": res.locals.userInfo.id,
    });

    // Nếu không tìm thấy roomChat hoặc người dùng không thuộc room
    if (!roomChat) {
      req.flash(
        "error",
        "Không tìm thấy phòng hoặc người dùng thuộc phòng này"
      );
      return res.redirect("/"); // Chuyển hướng nếu không tìm thấy room
    }

    // Tìm người dùng hiện tại trong mảng users của roomChat
    const currentUser = roomChat.users.find(
      (user) => user.user_id === res.locals.userInfo.id
    );

    // Kiểm tra nếu vai trò của người dùng là 'superAdmin'
    if (currentUser && currentUser.role === "superAdmin") {
      next(); // Người dùng là superAdmin, cho phép truy cập
    } else {
      req.flash("error", "Bạn không phải là quản trị viên");
      return res.redirect("back");
    }
  } catch (error) {
    next(error); // Gọi middleware xử lý lỗi
  }
};
