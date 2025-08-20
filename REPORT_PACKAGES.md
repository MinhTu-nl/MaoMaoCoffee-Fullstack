## REPORT: Packages và Công nghệ sử dụng

Tệp này tổng hợp các package chính và công nghệ được sử dụng trong project (dựa trên các `package.json` ở root, `Admin`, `FrontEnd`, `BackEnd`).

Ngày tạo: 2025-08-20

### Checklist
- [x] Đọc `package.json` ở `./package.json`, `./Admin/package.json`, `./FrontEnd/package.json`, `./BackEnd/package.json`
- [x] Tạo bảng liệt kê package (tên, version, nơi dùng, mục đích bằng tiếng Việt)

---

### Bảng liệt kê package

| Package | Version | Nơi dùng | Mục đích (tiếng Việt) |
|---|---:|---|---|
| concurrently | ^9.2.0 | root (`./package.json`) | Chạy nhiều tiến trình cùng lúc (ví dụ: khởi động FrontEnd, Admin, BackEnd) |
| vite | ^6.3.5 / ^6.2.0 | Admin / FrontEnd | Công cụ build/dev server (Vite) |
| react | ^18.3.1 / ^19.0.0 | Admin / FrontEnd | Thư viện giao diện người dùng (React) |
| react-dom | ^18.3.1 / ^19.0.0 | Admin / FrontEnd | Kết xuất React lên DOM |
| react-router-dom | ^7.6.1 / ^7.4.1 | Admin / FrontEnd | Quản lý điều hướng trên client |
| tailwindcss | ^3.4.17 | Admin, FrontEnd | Bộ tiện ích CSS (Tailwind) để viết giao diện nhanh |
| postcss | ^8.5.3 | Admin, FrontEnd | Xử lý CSS (PostCSS) |
| autoprefixer | ^10.4.21 | Admin, FrontEnd | Tự thêm tiền tố CSS cho trình duyệt |
| axios | ^1.8.4 / 1.9 | Admin / FrontEnd | Gửi yêu cầu HTTP tới API |
| react-toastify | ^11.0.5 | Admin, FrontEnd | Hiển thị thông báo/toast |
| chart.js | ^4.4.9 | Admin | Thư viện vẽ biểu đồ (Chart.js) |
| react-chartjs-2 | ^5.3.0 | Admin | Binding React cho Chart.js |
| recharts | ^2.15.3 | Admin | Thư viện biểu đồ React (tùy chọn) |
| swiper | ^11.2.8 | FrontEnd | Slider/carousel cho giao diện người dùng |
| @vitejs/plugin-react | ^4.3.1 / ^4.3.4 | Admin / FrontEnd | Plugin Vite hỗ trợ React |
| eslint, eslint-plugin-* | various | Admin, FrontEnd | Kiểm tra chất lượng mã (lint) |
| @types/react, @types/react-dom | ^18.x / ^19.x | Admin, FrontEnd | Kiểu cho React (dev) |
| globals | ^15.15.0 | FrontEnd | Định nghĩa global cho lint/tests |
| bcrypt | ^5.1.1 | BackEnd | Băm mật khẩu (hash password) |
| jsonwebtoken | ^9.0.2 | BackEnd | JWT cho xác thực/ủy quyền |
| express | ^4.19.2 | BackEnd | Framework server HTTP (Express) |
| mongoose | ^8.13.2 | BackEnd | ODM cho MongoDB |
| mongodb | ^6.16.0 | BackEnd | Driver MongoDB |
| cors | ^2.8.5 | BackEnd | Middleware xử lý CORS |
| dotenv | ^16.5.0 | BackEnd | Nạp biến môi trường từ `.env` |
| helmet | ^8.1.0 | BackEnd | Thiết lập header bảo mật cho HTTP |
| multer | ^2.0.0 | BackEnd | Xử lý upload file multipart |
| cloudinary | ^2.6.0 | BackEnd | Lưu trữ/serve ảnh lên Cloudinary |
| validator | ^13.15.0 | BackEnd | Hàm kiểm tra/validate dữ liệu |
| nodemon | ^3.0.0 | BackEnd | Tự động restart server trong dev |
| cross-env | ^7.0.3 | BackEnd | Thiết lập biến môi trường đa nền tảng |

---

### Tóm tắt công nghệ chính
- Backend: Node.js (yêu cầu Node >= 18), Express, MongoDB (Mongoose)
- Frontend/Admin: React + Vite, Tailwind CSS, PostCSS
- Auth/Security: JWT (`jsonwebtoken`), bcrypt, helmet, cors
- Storage & Upload: `multer` (upload multipart), Cloudinary (lưu ảnh)
- Charts/Visualization: Chart.js, react-chartjs-2, Recharts, Swiper (carousel)

---

Ghi chú:
- Một số package xuất hiện ở cả `dependencies` và `devDependencies` tùy theo cấu hình từng phần (ví dụ PostCSS/autoprefixer). Bạn có thể dùng file này để chèn trực tiếp vào báo cáo hoặc chuyển sang CSV nếu cần.

Nếu muốn, tôi có thể:
- Xuất file CSV tương ứng trong workspace (ví dụ `REPORT_PACKAGES.csv`).
- Hoàn thiện thêm phần "Hướng dẫn cài đặt" nhanh cho báo cáo.
