# Snoopy Shop 🛒

**Snoopy Shop** là một ứng dụng web thương mại điện tử hiện đại, được thiết kế để cung cấp trải nghiệm mua sắm trực tuyến dễ dàng, tiện lợi và thân thiện với người dùng. Dự án được xây dựng bằng **Node.js**, **Express**, và các công nghệ tiên tiến khác nhằm đáp ứng nhu cầu của các doanh nghiệp và người dùng cá nhân.

---

## 🚀 Tính năng chính

- **Giao diện thân thiện với người dùng**: Hỗ trợ thiết kế giao diện đẹp và dễ sử dụng.
- **Quản lý sản phẩm**: Thêm, sửa, xóa và quản lý danh mục sản phẩm.
- **Tích hợp giỏ hàng**: Cho phép người dùng thêm sản phẩm vào giỏ và thanh toán.
- **Quản lý người dùng**: Hỗ trợ đăng ký, đăng nhập và bảo mật tài khoản.
- **Kết nối thời gian thực**: Tích hợp WebSocket để cập nhật giỏ hàng và trạng thái đơn hàng ngay lập tức.
- **Tìm kiếm và lọc sản phẩm**: Dễ dàng tìm kiếm và sắp xếp sản phẩm theo nhu cầu.
- **Quản trị viên**: Giao diện quản trị riêng để quản lý đơn hàng, khách hàng và dữ liệu sản phẩm.

---

## 🛠️ Công nghệ sử dụng

- **Backend**:
  - [Node.js](https://nodejs.org/)
  - [Express.js](https://expressjs.com/)
- **Frontend**:
  - [Bootstrap](https://getbootstrap.com/) (CSS framework)
  - [Pug](https://pugjs.org/) (Template engine)
- **Database**:
  - MongoDB
- **Real-time**:
  - WebSocket (Socket.io)

---

## 📂 Cấu trúc thư mục

```plaintext
Snoopy-Shop/
├── config/          # Tệp cấu hình ứng dụng
├── controllers/     # Xử lý logic nghiệp vụ
├── helpers/         # Các hàm trợ giúp
├── middleware/      # Middleware của ứng dụng
├── models/          # Mô hình dữ liệu
├── public/          # Tệp tĩnh (CSS, JS, hình ảnh)
├── routes/          # Định nghĩa tuyến đường
├── socket/clients/  # Kết nối WebSocket
├── validate/        # Hàm xác thực
├── views/           # Template Pug
├── app.js           # File khởi động ứng dụng
├── package.json     # Quản lý phụ thuộc dự án
└── README.md        # File mô tả dự án
```
📦 Cách cài đặt
1. Clone dự án
git clone https://github.com/thanhlamcode/Snoopy-Shop.git
cd Snoopy-Shop
2. Cài đặt thư viện
npm install
4. Khởi động ứng dụng
npm start
Ứng dụng sẽ chạy tại http://localhost:3000.

🧪 Kiểm thử
Tạo người dùng mới
Thêm sản phẩm vào giỏ hàng
Kiểm tra giao diện quản trị viên
Thực hiện thanh toán thử nghiệm

📄 Giấy phép
Dự án này được cấp phép dưới MIT License.

🌟 Tác giả
Đoàn Thanh Lâm
Nếu bạn cần thêm thông tin, hãy liên hệ qua email hoặc tạo issue trên GitHub. Cảm ơn đã ghé thăm! 🎉
