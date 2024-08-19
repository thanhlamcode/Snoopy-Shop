const User = require("../../models/users.model");

module.exports.infoUser = async (req, res, next) => {
  try {
    if (req.cookies.tokenUser) {
      const user = await User.findOne({
        tokenUser: req.cookies.tokenUser,
      });

      // console.log(user);

      res.locals.userInfo = user;
    }

    next();
  } catch (error) {
    next(error);
  }
};
