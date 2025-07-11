import jwt from 'jsonwebtoken'

const adminAuth = (req, res, next) => {
    try {
        // Ưu tiên lấy token từ Authorization header
        let token = null;
        const authHeader = req.headers.authorization || req.headers.Authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        } else if (req.headers.token) {
            token = req.headers.token;
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized login Again'
            });
        }

        const token_decode = jwt.verify(token, process.env.JWT_SECRET);

        // Kiểm tra email trong payload đã giải mã
        if (token_decode.email !== process.env.ADMIN_EMAIL) {
            return res.status(403).json({
                success: false,
                message: "Not authorized login Again"
            });
        }
        next();
    } catch (e) {
        console.log(e);
        // jwt.verify throws errors like TokenExpiredError, JsonWebTokenError
        return res.status(401).json({
            success: false, message: e.message
        });
    }
}

export default adminAuth;