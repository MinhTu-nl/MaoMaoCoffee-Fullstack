# Middleware Folder

Thư mục này chứa các middleware dùng cho hệ thống backend. Dưới đây là mô tả chức năng của từng file:

---

### 1. `adminAuth.js`
- **Chức năng:** Xác thực quyền truy cập của admin dựa trên token JWT.
- **Đặc điểm:**
  - Lấy token từ header (`req.headers.token`).
  - Giải mã token và kiểm tra email có trùng với email admin trong biến môi trường không.
  - Nếu không hợp lệ sẽ trả về lỗi 401 hoặc 403.

---

### 2. `auth.js`
- **Chức năng:** Xác thực người dùng thông thường dựa trên token JWT.
- **Đặc điểm:**
  - Lấy token từ header dạng `Bearer <token>`.
  - Giải mã token và kiểm tra có trường `id` trong payload không.
  - Thêm thông tin user vào `req.user` nếu hợp lệ.
  - Xử lý lỗi token hết hạn hoặc không hợp lệ.

---

### 3. `authMiddleware.js`
- **Chức năng:** Middleware xác thực JWT cho các route cần bảo vệ.
- **Đặc điểm:**
  - Lấy token từ header dạng `Bearer <token>`.
  - Giải mã token và gán thông tin user vào `req.user`.
  - Trả về lỗi nếu token không hợp lệ hoặc không có token.

---

### 4. `multer.js`
- **Chức năng:** Cấu hình middleware để upload file sử dụng Multer.
- **Đặc điểm:**
  - Lưu file upload với tên gốc (`originalname`).
  - Xuất ra một instance của Multer để sử dụng trong các route upload file.
