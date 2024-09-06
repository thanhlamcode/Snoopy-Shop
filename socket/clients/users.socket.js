const User = require("../../models/users.model");

module.exports = async (res) => {
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
    });

    socket.on("CLIENT_CANCEL_FRIEND", async (userId) => {
      const myUserId = res.locals.userInfo.id;

      console.log(userId);
      console.log(myUserId);

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
    });

    socket.on("CLIENT_SEND_ACCEPT", async (userId) => {
      const myUserId = res.locals.userInfo.id;

      console.log("Id được kết bạn: ", userId);
      console.log("Id tài khoản gốc: ", myUserId);

      // xóa B khỏi requestFriend của A
      // await User.updateOne(
      //   {
      //     _id: myUserId,
      //   },
      //   {
      //     $pull: { requestFriend: userId },
      //   }
      // );

      // xóa A khỏi acceptFriend của B
      // await User.updateOne(
      //   {
      //     _id: userId,
      //   },
      //   {
      //     $pull: { acceptFriend: myUserId },
      //   }
      // );
    });

    socket.on("CLIENT_SEND_DECLINE", async (userId) => {
      const myUserId = res.locals.userInfo.id;

      console.log("Id được xóa kết bạn: ", userId);
      console.log("Id tài khoản gốc: ", myUserId);

      // xóa B khỏi requestFriend của A
      // await User.updateOne(
      //   {
      //     _id: myUserId,
      //   },
      //   {
      //     $pull: { requestFriend: userId },
      //   }
      // );

      // xóa A khỏi acceptFriend của B
      // await User.updateOne(
      //   {
      //     _id: userId,
      //   },
      //   {
      //     $pull: { acceptFriend: myUserId },
      //   }
      // );
    });
  });
};
