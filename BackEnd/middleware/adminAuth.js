import jwt from 'jsonwebtoken'

// Middleware xác thực admin
// Cách hoạt động:
// - Tìm token ưu tiên từ header Authorization: Bearer <token>,
//   nếu không có, fallback kiểm tra req.headers.token (một số client có thể gửi như vậy).
// - Giải mã token và kiểm tra payload.email có khớp với ADMIN_EMAIL trong env không.
// - Trả về 401 nếu không có token hoặc token không hợp lệ; trả về 403 nếu không phải admin.
const adminAuth = (req, res, next) => {
    try {
        // Lấy token từ header hoặc từ trường token
        let token = null;
        const authHeader = req.headers.authorization || req.headers.Authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        } else if (req.headers.token) {
            // Một số client có thể gửi token không theo chuẩn Bearer
            token = req.headers.token;
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized login Again'
            });
        }

        // Giải mã token
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);

        // Kiểm tra email trong payload có khớp admin email không
        if (token_decode.email !== process.env.ADMIN_EMAIL) {
            return res.status(403).json({
                success: false,
                message: "Not authorized login Again"
            });
        }
        next();
    } catch (e) {
        console.log(e);
        // jwt.verify có thể ném TokenExpiredError hoặc JsonWebTokenError
        return res.status(401).json({
            success: false, message: e.message
        });
    }
}

export default adminAuth;