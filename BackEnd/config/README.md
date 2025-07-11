# Config Folder

Thư mục này chứa các file cấu hình cho hệ thống backend. Dưới đây là mô tả chức năng của từng file:

---

### 1. `cloudinary.js`
- **Chức năng:** Kết nối và cấu hình Cloudinary để upload và quản lý file ảnh trên cloud.
- **Đặc điểm:**
  - Sử dụng các biến môi trường để cấu hình (`cloud_name`, `api_key`, `api_secret`).
  - Xuất ra hàm kết nối để sử dụng khi khởi động server.

---

### 2. `mongodb.js`
- **Chức năng:** Kết nối tới cơ sở dữ liệu MongoDB sử dụng Mongoose.
- **Đặc điểm:**
  - Sử dụng biến môi trường `MONGODB_URL` để lấy thông tin kết nối.
  - Xử lý lỗi kết nối và log ra console nếu thành công hoặc thất bại.
