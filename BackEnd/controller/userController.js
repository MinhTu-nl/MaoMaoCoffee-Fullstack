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
    try {
        const { email, password } = req.body;

        // Kiểm tra thông tin đăng nhập
        if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
            return res.status(401).json({
                success: false,
                message: 'Invalid admin credentials'
            });
        }

        // Tạo token với payload là object chứa email
        const token = jwt.sign(
            { email: process.env.ADMIN_EMAIL }, // Payload là object
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            message: 'Admin login successful',
            token
        });

    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error during admin login'
        });
    }
}

const listUsers = async (req, res) => {
    try {
        // Lấy tất cả users từ database, loại bỏ trường password
        const users = await userModel.find({}, { password: 0 });

        res.json({
            success: true,
            users
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching users'
        });
    }
}

export { loginUser, registerUser, adminLogin, listUsers }