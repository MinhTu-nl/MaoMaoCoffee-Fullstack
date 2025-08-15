# MaoMao Backend

## Local Development

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Cấu hình môi trường
Tạo file `.env` trong thư mục gốc với nội dung:
```env
NODE_ENV=development
PORT=4000
MONGODB_URI=mongodb://localhost:27017/maomao
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=http://localhost:3000
```

### 3. Chạy server local
```bash
# Chạy với NODE_ENV=development (Windows/Linux/Mac)
npm run server

# Hoặc chạy với nodemon (auto restart)
npm run dev

# Hoặc chạy trực tiếp
npm start
```

### 4. Kiểm tra server
- Server sẽ chạy tại: http://localhost:4000
- Health check: http://localhost:4000/health
- API base: http://localhost:4000/api

## Production (Vercel)

### Deploy
```bash
vercel --prod
```

### Cấu hình
- `vercel.json` đã được cấu hình sẵn
- `NODE_ENV` sẽ tự động được set thành `production` trên Vercel
- Server sẽ export handler function thay vì chạy local server

## Scripts

- `npm run server` - Chạy local development server (cross-platform)
- `npm run dev` - Chạy với nodemon (auto restart)
- `npm start` - Chạy production server
- `npm run build` - Build project

## Lưu ý

- Khi chạy local: `NODE_ENV=development` → Server sẽ khởi động và lắng nghe port
- Khi deploy Vercel: `NODE_ENV=production` → Server sẽ export handler function
- Cả hai mode đều sử dụng cùng một Express app
- Database connection được xử lý tự động cho cả hai môi trường
- Sử dụng `cross-env` để tương thích với Windows, Linux và Mac
