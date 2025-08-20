# Hướng dẫn cài đặt & di chuyển project MaoMao Coffee

Tài liệu này mô tả các bước cần thiết để cài đặt, thiết lập môi trường và chạy project khi bạn di chuyển source code sang máy khác.

## Yêu cầu hệ thống

- Node.js >= 22.x
- npm (hoặc yarn/pnpm)
- MongoDB (local hoặc hosted, ví dụ MongoDB Atlas)
- Cloudinary account (nếu muốn upload ảnh)

## Cấu trúc dự án

- `FrontEnd/` — ứng dụng khách (React + Vite)
- `Admin/` — dashboard quản trị (React + Vite)
- `BackEnd/` — server (Node.js + Express + MongoDB)

## Bước 1 — Sao chép mã nguồn

Sao chép toàn bộ thư mục dự án vào máy mới bằng git clone hoặc copy file.

## Bước 2 — Cài Node.js và npm

Cài Node.js 18+ từ https://nodejs.org/ hoặc quản lý phiên bản Node (nvm-windows, nvm). Sau khi cài, kiểm tra:
(Hiện tại dự án đang chạy Node.js phiên bản 22)
```powershell
node -v
npm -v
```

## Bước 3 — Thiết lập biến môi trường cho BackEnd

1. Vào thư mục `BackEnd/`.
2. Tạo file `.env` (copy từ `.env.example` nếu có):

```powershell
cd BackEnd; cp .env.example .env
# trên Windows PowerShell nếu cp không tồn tại dùng:
# copy .env.example .env
```

3. Mở `BackEnd/.env` và cấu hình:

- `MONGO_URI` — chuỗi kết nối MongoDB
- `JWT_SECRET` — khóa dùng cho JWT
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — nếu dùng Cloudinary
- Bất kỳ biến môi trường khác được dự án yêu cầu

## Bước 4 — Cài dependencies

Từ thư mục gốc bạn có thể cài riêng từng phần hoặc toàn bộ.

Cài cho cả 3 dự án riêng lẻ: 


```powershell
# FrontEnd
cd FrontEnd; npm install; cd..
# Admin
cd Admin; npm install; cd ..
# BackEnd
cd BackEnd; npm install; cd ..
```

Hoặc cài song song (yêu cầu có concurrently cài global hoặc dev dành cho root):

```powershell
npm install # cài concurrently ở root nếu cần
npm run maomao # sẽ chạy cả 3 (chạy dev cho FrontEnd, Admin, server cho BackEnd)
```

> Ghi chú: Root `package.json` có script `maomao` dùng `concurrently` để chạy:
>
> npm run maomao -> sẽ thực thi:
> - `npm --prefix FrontEnd run dev`
> - `npm --prefix Admin run dev`
> - `npm --prefix BackEnd run server`

## Bước 5 — Chạy ứng dụng (phát triển)

Bạn có 2 cách:

1) Chạy từng phần riêng lẻ (khuyên dùng khi phát triển 1 phần):

```powershell
# Chạy backend với nodemon
cd BackEnd; npm run dev

# Chạy frontend (customer)
cd FrontEnd; npm run dev

# Chạy admin
cd Admin; npm run dev
```

2) Chạy cả 3 cùng lúc (từ gốc):

```powershell
npm run maomao
```

- Backend có các script:
  - `npm run dev` — khởi động server với nodemon
  - `npm run server` — start node server với NODE_ENV=development
  - `npm run start` — start bằng node

- FrontEnd/Admin đều dùng vite:
  - `npm run dev` — chạy vite dev server
  - `npm run build` — build production
  - `npm run preview` — preview build

## Bước 6 — Build production

- FrontEnd:

```powershell
cd FrontEnd; npm run build
```

- Admin:

```powershell
cd Admin; npm run build
```

- Backend: tùy nhu cầu, server Node có thể được deploy trực tiếp (Heroku, Vercel serverless functions, VPS...). Nếu cần đóng gói, đảm bảo cài environment variables trên môi trường production.

## Bước 7 — Cấu hình deployment

- Nếu deploy backend lên Vercel hoặc Heroku, thiết lập các biến môi trường (MONGO_URI, JWT_SECRET, CLOUDINARY_*).
- Frontend/Admin có thể deploy lên Vercel, Netlify hoặc bất kỳ static host nào từ folder `dist` sau khi build.

## Một số lưu ý kỹ thuật

- Node engine: backend yêu cầu Node >= 18.
- Nếu gặp lỗi CORS, kiểm tra cấu hình `BackEnd/server.js` và biến môi trường.
- Nếu không muốn cài `concurrently`, bạn có thể chạy từng folder trong tabs terminal khác nhau.

## Kiểm tra nhanh sau cài

1. Chạy `BackEnd` và kiểm tra server log (mặc định cổng thường là 4000 hoặc được cấu hình trong server.js).
2. Truy cập `http://localhost:4000` hoặc port Vite in console cho FrontEnd và Admin.

## Gỡ lỗi thường gặp

- Thiếu biến môi trường -> lỗi kết nối DB hoặc lỗi auth
- Phiên bản Node quá thấp -> nâng Node lên >=18
- Thiếu dependencies -> chạy `npm install` trong từng folder

---

Nếu bạn muốn, tôi có thể tiếp tục và:
- Thêm file `BackEnd/.env.example` (sao chép/chuẩn hóa) nếu thiếu
- Viết script Dockerfile / docker-compose để dễ di chuyển
- Tạo script `start-all` cross-platform khác (ví dụ dùng npm-run-all)

Hãy cho biết bạn muốn tôi thêm phần nào nữa.

## Deloy sản phẩm demo trên vercel
Frontend: 
`https://mao-mao-coffee.vercel.app/`
Admin: 
`https://mao-mao-admin.vercel.app/`