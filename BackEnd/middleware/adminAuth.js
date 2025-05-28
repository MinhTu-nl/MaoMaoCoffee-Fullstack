import jwt from 'jsonwebtoken'

const adminAuth = (req, res, next) => {
    try {
        const { token } = req.headers
        if (!token) {
            return res.json({
                success: false,
                message: 'Not authorized login Again'
            })
        }
        const token_decode = jwt.verify(token, process.env.JWT_SECRET)

        // Kiểm tra email trong payload đã giải mã
        if (token_decode.email !== process.env.ADMIN_EMAIL) {
            return res.json({
                success: false,
                message: "Not authorized login Again"
            })
        }
        next()
    } catch (e) {
        console.log(e)
        res.json({
            success: false, message: e.message
        })
    }
}

export default adminAuth;