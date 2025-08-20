import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cartData: { type: Object, default: {} },
    // reviewData: { type: Array, default: [] },
    contactData: {
        type: [
            {
                name: String,
                email: String,
                message: String,
                date: Date,
                feedback: { type: String, default: '' },
                _id: String
            }
        ],
        default: []
    },
}, { minimize: false })

const userModel = mongoose.models.user || mongoose.model('user', userSchema);
export default userModel;

// Ghi chú:
// - `cartData` lưu giỏ hàng trên document user (cấu trúc tuỳ ứng dụng: productId, size, quantity,...).
// - `contactData` giữ lịch sử liên hệ/feedback của user (dùng cho admin xem và trả lời).
// - `{ minimize: false }` đảm bảo Mongoose không loại bỏ các trường rỗng khi lưu.