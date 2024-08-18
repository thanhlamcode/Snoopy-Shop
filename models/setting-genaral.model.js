const mongoose = require("mongoose");

const settingGenaralSchema = new mongoose.Schema(
  {
    websiteName: String,
    logo: String,
    phone: String,
    email: String,
    address: String,
    copyright: String,
  },
  {
    timestamps: true,
  }
);

const SettingGenaral = mongoose.model(
  "SettingGenaral",
  settingGenaralSchema,
  "setting-genaral"
);

module.exports = SettingGenaral;
