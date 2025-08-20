import { v2 as cloudinary } from 'cloudinary';

// Kết nối / cấu hình Cloudinary sử dụng biến môi trường
const connectCloudinary = async () => {
    try {
        // Hỗ trợ nhiều tên biến môi trường (tùy môi trường deploy)
        const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_NAME;
        const apiKey = process.env.CLOUDINARY_API_KEY;
        const apiSecret = process.env.CLOUDINARY_API_SECRET;

        // Nếu thiếu thông tin, chỉ log cảnh báo và không throw - app vẫn có thể chạy nhưng các API upload sẽ không hoạt động
        if (!cloudName || !apiKey || !apiSecret) {
            console.warn('Cloudinary configuration incomplete. Some features may not work.');
            return;
        }

        // Cấu hình client Cloudinary
        cloudinary.config({
            cloud_name: cloudName,
            api_key: apiKey,
            api_secret: apiSecret,
        });

        console.log('Cloudinary configured successfully!');
    } catch (error) {
        // Log lỗi cấu hình
        console.error('Cloudinary configuration error:', error);
        // Trong development, thoát process để nhà phát triển nhận biết lỗi; production thì không exit
        if (process.env.NODE_ENV !== 'production') {
            process.exit(1);
        }
    }
}

export default connectCloudinary;