const SettingGenaral = require("../../models/setting-genaral.model");

// [GET] /admin/setting/general
module.exports.general = async (req, res) => {
  const record = await SettingGenaral.findOne({});

  res.render("admin/pages/setting/general", {
    pageTitle: "Cài đặt chung",
    record: record,
  });
};

// [PATCH] /admin/setting/general
module.exports.generalPost = async (req, res) => {
  const record = await SettingGenaral.findOne({});

  await SettingGenaral.updateOne(
    {
      _id: record.id,
    },
    req.body
  );

  res.redirect("back");
};
