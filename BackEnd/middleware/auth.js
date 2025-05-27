import jwt from 'jsonwebtoken'

const authUser = async (req, res, next) => {
    const { token } = req.headers

    if (!token) {
        return res.json({
            success: false,
            message: 'Not Authorized login Again'
        })
    }

    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET)
        req.body.userId = token_decode.id
    } catch (e) {
        console.log(e)
        res.json({
            success: false,
            message: e.message
        })
    }
}

export default authUser