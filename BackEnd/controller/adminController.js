import jwt from 'jsonwebtoken';

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
};

export { adminLogin }; 