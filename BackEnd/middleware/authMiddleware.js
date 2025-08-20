import jwt from 'jsonwebtoken';

// Middleware xác thực JWT (phiên bản async)
// Tương tự `auth.js` nhưng được đặt tên khác trong repo.
// Mong đợi header: Authorization: "Bearer <token>".
const authMiddleware = async (req, res, next) => {
    try {
        // Lấy token từ header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            });
        }

        const token = authHeader.split(' ')[1];

        // Verify token bằng secret trong env
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Gắn payload đã decode vào req.user để controller sử dụng
        req.user = decoded;

        next();
    } catch (error) {
        // Ghi log để dễ debug thông tin token lỗi
        console.error('Auth middleware error:', error);
        return res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }
};

export default authMiddleware; 