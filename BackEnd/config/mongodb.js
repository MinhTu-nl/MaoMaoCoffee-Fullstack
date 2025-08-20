import mongoose from "mongoose";

// Keep a cached connection across invocations (serverless safe)
// Khi chạy trên serverless (Vercel, Netlify functions...), mỗi cold-start có thể tạo nhiều kết nối
// nên cache kết nối trong biến global để tránh tạo nhiều connection tới MongoDB.
let cached = global._mongooseCachedConnection;
if (!cached) {
    cached = global._mongooseCachedConnection = { conn: null, promise: null };
}

const connectDB = async () => {
    try {
        // Nếu đã có kết nối cached thì trả về luôn (tăng hiệu năng)
        if (cached.conn) {
            return cached.conn;
        }

        // Nếu chưa có promise kết nối, tạo mới và lưu vào cached.promise
        if (!cached.promise) {
            const mongoUri = process.env.MONGODB_URI || process.env.MONGODB_URL;
            if (!mongoUri) {
                // Nếu thiếu biến môi trường, ném lỗi để dev nhận biết
                throw new Error('MongoDB connection string is not defined. Please set MONGODB_URI.');
            }
            // Lưu promise để các lần gọi tiếp theo dùng chung promise (tránh gọi mongoose.connect nhiều lần)
            cached.promise = mongoose
                .connect(mongoUri)
                .then((mongooseInstance) => mongooseInstance);
        }

        // chờ promise hoàn tất và lưu connection vào cached.conn
        cached.conn = await cached.promise;
        console.log('MONGODB CONNECT SUCCESSFULLY!');
        return cached.conn;
    } catch (error) {
        console.error('MongoDB connection error:', error);
        // Trong dev: exit để developer biết; production để giữ server chạy
        if (process.env.NODE_ENV !== 'production') {
            process.exit(1);
        }
    }
};

export default connectDB;