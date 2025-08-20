import jwt from 'jsonwebtoken'

// Middleware xác thực token JWT cơ bản cho user
// - Mong đợi header Authorization: "Bearer <token>"
// - Sau khi verify, gán payload đã decode vào `req.user` (thường chứa field `id`)
// - Trả về 401 khi không có token, format sai, token hết hạn hoặc token không hợp lệ
const verifyToken = (req, res, next) => {
    try {
        // Lấy token từ header Authorization
        // VD: Authorization: "Bearer eyJhbGciOi..."
        const authHeader = req.headers.authorization
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            // Không có token hoặc format không phải Bearer
            return res.status(401).json({
                success: false,
                message: "No token provided or invalid format"
            })
        }

        const token = authHeader.split(' ')[1]

        // Verify token bằng secret từ env
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // Kiểm tra structure payload tối thiểu (ứng dụng này mong có id)
        if (!decoded.id) {
            return res.status(401).json({
                success: false,
                message: "Invalid token format"
            })
        }

        // Gắn thông tin user đã decode vào request để controller dùng (vd: req.user.id)
        req.user = decoded
        next()
    } catch (error) {
        // jwt.verify có thể ném TokenExpiredError, JsonWebTokenError, v.v.
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: "Token has expired"
            })
        }
        // Các lỗi khác: token không hợp lệ
        return res.status(401).json({
            success: false,
            message: "Invalid token"
        })
    }
}

export default verifyToken