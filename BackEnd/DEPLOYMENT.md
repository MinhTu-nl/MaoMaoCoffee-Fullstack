# Hướng dẫn Deploy Backend lên Vercel

## Bước 1: Cài đặt Vercel CLI
```bash
npm install -g vercel
```

## Bước 2: Đăng nhập Vercel
```bash
vercel login
```

## Bước 3: Cấu hình Environment Variables trên Vercel Dashboard

Truy cập [Vercel Dashboard](https://vercel.com/dashboard) và thêm các environment variables sau:

### Required Variables:
- `MONGODB_URI`: Connection string MongoDB của bạn (hoặc MONGODB_URL)
- `JWT_SECRET`: Secret key cho JWT
- `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name (hoặc CLOUDINARY_NAME)
- `CLOUDINARY_API_KEY`: Cloudinary API key
- `CLOUDINARY_API_SECRET`: Cloudinary API secret

### Optional Variables:
- `NODE_ENV`: production
- `PORT`: 4000
- `CORS_ORIGIN`: URL frontend của bạn

## Bước 4: Deploy
```bash
vercel --prod
```

## Bước 5: Kiểm tra logs nếu có lỗi
```bash
vercel logs
```

## Lưu ý quan trọng:
1. **MongoDB Atlas**: Đảm bảo MongoDB Atlas cho phép kết nối từ Vercel IP (0.0.0.0/0)
2. **CORS**: Kiểm tra CORS configuration nếu frontend và backend ở domain khác nhau
3. **Environment Variables**: Đảm bảo tất cả environment variables được set đúng trên Vercel
4. **Node.js Version**: Vercel sẽ sử dụng Node.js 18.x theo cấu hình trong vercel.json

## Troubleshooting:
- Nếu gặp lỗi "Cannot find module", kiểm tra:
  - Environment variables đã được set đúng chưa
  - MongoDB connection string có đúng format không
  - Cloudinary credentials có chính xác không

## Test API sau khi deploy:
- Health check: `https://your-domain.vercel.app/health`
- Root endpoint: `https://your-domain.vercel.app/`
