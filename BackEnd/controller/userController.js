import jwt from 'jsonwebtoken'
import userModel from '../model/userModel.js';
import bcrypt from 'bcrypt'
import validator from 'validator'

// Tạo JWT token đơn giản với payload chứa user id
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}

// Đăng nhập user: kiểm tra email/password, trả về token nếu hợp lệ
const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body;
        // Tìm user theo email
        const user = await userModel.findOne({ email })

        if (!user) return res.json({
            success: false,
            message: 'User not found'
        })

        // So sánh password plaintext với hash trong DB
        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = createToken(user._id)
            res.json({
                success: true,
                token
            })
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


// Đăng ký user: kiểm tra email hợp lệ, password đủ dài, hash password rồi lưu
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

        // Tạo token cho admin (payload chứa email admin). Thời hạn 24h
        const token = jwt.sign(
            { email: process.env.ADMIN_EMAIL },
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

const getUser = async (req, res) => {
    try {
        // Lấy user ID từ token đã được verify trong middleware
        const userId = req.user.id;

        // Tìm user trong database, chỉ lấy name và email
        const user = await userModel.findById(userId).select('name email');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            data: user
        });

    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching user profile'
        });
    }
}

// Validate admin token
const validateAdminToken = async (req, res) => {
    try {
        // Nếu middleware authMiddleware đã pass, nghĩa là token hợp lệ
        res.json({
            success: true,
            message: 'Token hợp lệ'
        })
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Token không hợp lệ'
        })
    }
}

// Change password function
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        // Validate input
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng cung cấp mật khẩu hiện tại và mật khẩu mới'
            });
        }

        // Validate new password length
        if (newPassword.length < 8) {
            return res.status(400).json({
                success: false,
                message: 'Mật khẩu mới phải có ít nhất 8 ký tự'
            });
        }

        // Find user
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy người dùng'
            });
        }

        // Xác thực mật khẩu hiện tại trước khi cho phép đổi mật khẩu
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            return res.status(400).json({
                success: false,
                message: 'Mật khẩu hiện tại không đúng'
            });
        }

        // Hash mật khẩu mới và lưu vào DB
        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedNewPassword;
        await user.save();

        res.json({
            success: true,
            message: 'Mật khẩu đã được thay đổi thành công'
        });

    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Lỗi khi thay đổi mật khẩu'
        });
    }
}

export { loginUser, registerUser, adminLogin, listUsers, getUser, validateAdminToken, changePassword }