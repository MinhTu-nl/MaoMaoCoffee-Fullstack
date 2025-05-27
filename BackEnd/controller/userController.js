import jwt from 'jsonwebtoken'
import userModel from '../model/userModel.js';
import bcrypt from 'bcrypt'
import validator from 'validator'

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}

const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body;
        // Tìm kiếm user trong database dựa vào email
        const user = await userModel.findOne({ email })

        //Kiểm tra nếu không tìm thấy user, Kiểm tra nếu không tìm thấy user
        if (!user) return res.json({
            success: false,
            message: 'User not found'
        })

        // So sánh password người dùng nhập với password đã được mã hóa trong database
        const isMatch = await bcrypt.compare(password, user.password)

        // Nếu password khớp:
        //     Tạo JWT token với ID của user
        //     Trả về response thành công kèm token
        if (isMatch) {
            const token = createToken(user._id)
            res.json({
                success: true,
                token
            })
            // ngược lại: trả về res thất bại vs thông báo lỗi
        } else {
            res.json({
                success: false,
                message: 'Invalid credentials'
            })
        }
    } catch (e) {
        console.log(e)
        res.json({
            success: false,
            message: e.message
        })
    }
}


const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body
        const exists = await userModel.findOne({ email })

        if (exists) return res.json({
            success: false,
            message: 'User already exists'
        })

        if (!validator.isEmail(email)) {
            return res.json({
                success: false,
                message: 'plase enter invalid email'
            })
        }

        if (password.length < 8) {
            return res.json({
                success: false,
                message: 'password must be at least 8 characters'
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({
            name, email, password: hashPassword,
        })

        const user = await newUser.save()
        const token = createToken(user._id)
        res.json({
            success: true,
            token
        })

    } catch (e) {
        console.log(e)
        res.json({
            success: false,
            message: e.message
        })
    }
}

const adminLogin = async (req, res) => {

}

export { loginUser, registerUser, adminLogin }