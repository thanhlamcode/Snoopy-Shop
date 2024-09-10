const User = require("../../models/users.model");
const RoomChat = require("../../models/room-chat.model");

module.exports = async (req, res) => {
  _io.once("connection", (socket) => {
    socket.on("CLIENT_ADD_FRIEND", async (userId) => {
      const myUserId = res.locals.userInfo.id;

      // thêm B vào requestFriend của A

      const exitsUserA = await User.findOne({
        _id: myUserId,
        requestFriend: userId,
      });

      if (!exitsUserA) {
        await User.updateOne(
          {
            _id: myUserId,
          },
          {
            $push: { requestFriend: userId },
          }
        );
      }

      // thêm A vào acceptFriend của B
      const exitsUserB = await User.findOne({
        _id: userId,
        acceptFriend: myUserId,
      });

      if (!exitsUserB) {
        await User.updateOne(
          {
            _id: userId,
          },
          {
            $push: { acceptFriend: myUserId },
          }
        );
      }

      const userB = await User.findOne({ _id: userId });

      socket.broadcast.emit("SERVER_RETURN_ADD_FRIEND", {
        userId: userB.id,
        lengthAcceptFriend: userB.acceptFriend.length,
      });
    });

    socket.on("CLIENT_CANCEL_FRIEND", async (userId) => {
      const myUserId = res.locals.userInfo.id;

      // console.log(userId);
      // console.log(myUserId);

      // xóa B khỏi requestFriend của A
      await User.updateOne(
        {
          _id: myUserId,
        },
        {
          $pull: { requestFriend: userId },
        }
      );

      // xóa A khỏi acceptFriend của B
      await User.updateOne(
        {
          _id: userId,
        },
        {
          $pull: { acceptFriend: myUserId },
        }
      );

      const userB = await User.findOne({ _id: userId });

      socket.broadcast.emit("SERVER_RETURN_CANCEL_FRIEND", {
        userId: userB.id,
        lengthAcceptFriend: userB.acceptFriend.length,
      });
    });

    socket.on("CLIENT_SEND_ACCEPT", async (userId) => {
      const myUserId = res.locals.userInfo.id;

      console.log("Id được kết bạn: ", userId);
      console.log("Id tài khoản gốc: ", myUserId);

      const dataRoom = {
        typeRoom: "friend",
        users: [
          {
            user_id: userId,
            role: "superAdmin",
          },
          {
            user_id: myUserId,
            role: "superAdmin",
          },
        ],
      };

      const roomChat = new RoomChat(dataRoom);
      await roomChat.save();

      // Thêm B vào friendList của A và xóa B ra khỏi acceptFriend của A
      await User.updateOne(
        {
          _id: myUserId,
        },
        {
          $push: {
            friendList: {
              user_id: userId,
              room_chat_id: roomChat.id,
            },
          },
        }
      );

      await User.updateOne(
        {
          _id: myUserId,
        },
        {
          $pull: { acceptFriend: userId },
        }
      );

      // Thêm A vào friendList của B
      await User.updateOne(
        {
          _id: userId,
        },
        {
          $push: {
            friendList: {
              user_id: myUserId,
              room_chat_id: roomChat.id,
            },
          },
        }
      );

      await User.updateOne(
        {
          _id: userId,
        },
        {
          $pull: { requestFriend: myUserId },
        }
      );

      // Xử lý hiển thị thông báo

      const userA = await User.findOne({ _id: myUserId });
      const userB = await User.findOne({ _id: userId });

      socket.broadcast.emit("SERVER_SEND_SUCCESS_ADD_FRIEND", {
        fullName: userA.fullName,
        userId: userId,
        length: userB.friendList.length,
      });
      // End Xử lý hiển thị thông báo
    });

    socket.on("CLIENT_SEND_DECLINE", async (userId) => {
      const myUserId = res.locals.userInfo.id;

      console.log("Id được xóa kết bạn: ", userId);
      console.log("Id tài khoản gốc: ", myUserId);

      // Xóa B khỏi acceptFriend của A
      await User.updateOne(
        {
          _id: myUserId,
        },
        {
          $pull: { acceptFriend: userId },
        }
      );

      // xóa A khỏi requestFriend của B
      await User.updateOne(
        {
          _id: userId,
        },
        {
          $pull: { requestFriend: myUserId },
        }
      );
    });

    socket.on("CLIENT_SEND_DELETE_FRIEND", async (userId) => {
      const myUserId = res.locals.userInfo.id;
      console.log("Vào đây");

      await User.updateOne(
        { _id: myUserId },
        {
          $pull: { friendList: { user_id: userId } },
        }
      );

      await User.updateOne(
        { _id: userId },
        {
          $pull: { friendList: { user_id: myUserId } },
        }
      );
    });
  });
};
