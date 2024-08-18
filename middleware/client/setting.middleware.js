const SettingGenaral = require("../../models/setting-genaral.model");

module.exports.settingGeneral = async (req, res, next) => {
  try {
    const settingGeneral = await SettingGenaral.findOne({});

    res.locals.settingGeneral = settingGeneral;
    // console.log(settingGeneral);

    next();
  } catch (error) {
    next(error);
  }
};
