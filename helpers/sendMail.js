const nodemailer = require("nodemailer");
module.exports.sendMail = (email, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: subject,
    html: html,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    // Đã sửa từ mailoptions thành mailOptions
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response); // Thêm dấu ngoặc đơn để nối chuỗi
      // do something useful
    }
  });
};
