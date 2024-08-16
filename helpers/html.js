module.exports.html = (otp) => {
  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>OTP Notification</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f9;
              color: #333;
              margin: 0;
              padding: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
          }
          .container {
              background: #ffffff;
              border-radius: 8px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              padding: 20px;
              max-width: 500px;
              width: 100%;
              text-align: center;
          }
          h1 {
              color: #333;
              font-size: 24px;
              margin-bottom: 10px;
          }
          p {
              font-size: 16px;
              line-height: 1.5;
          }
          .otp {
              font-size: 24px;
              font-weight: bold;
              color: #007bff;
          }
          .footer {
              margin-top: 20px;
              font-size: 14px;
              color: #666;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <h1>Mã OTP để lấy lại mật khẩu</h1>
          <p>
              Mã OTP của bạn là <span class="otp">${otp}</span>. 
              Thời hạn sử dụng là 3 phút.
          </p>
          <div class="footer">
              Nếu bạn không yêu cầu khôi phục mật khẩu, vui lòng bỏ qua email này.
          </div>
      </div>
  </body>
  </html>
  `;

  return html;
};
