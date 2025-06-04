import jwt from 'jsonwebtoken'

const verifyToken = (req, res, next) => {
    try {
        // Lấy token từ header
        const authHeader = req.headers.authorization
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: "No token provided or invalid format"
            })
        }

        const token = authHeader.split(' ')[1]

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // Kiểm tra token có chứa id không
        if (!decoded.id) {
            return res.status(401).json({
                success: false,
                message: "Invalid token format"
            })
        }

        // Thêm thông tin user vào request
        req.user = decoded
        next()
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: "Token has expired"
            })
        }
        return res.status(401).json({
            success: false,
            message: "Invalid token"
        })
    }
}

export default verifyToken