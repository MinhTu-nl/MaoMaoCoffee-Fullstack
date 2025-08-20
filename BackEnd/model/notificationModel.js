import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['order', 'review', 'contact', 'register'],
        required: true
    },
    message: {
        type: String,
        required: true
    },
    data: {
        type: Object,
        default: {}
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
export default Notification;

// Ghi chú:
// - `type`: loại thông báo (order/review/contact/register) để frontend có thể render icon/điều hướng phù hợp.
// - `message`: nội dung hiển thị ngắn.
// - `data`: object tuỳ ý dùng để chứa các dữ liệu liên quan (ví dụ orderId, userId, productId).
// - `isRead`: cờ đánh dấu đã đọc.
// - `timestamps` thêm `createdAt`/`updatedAt` để sắp xếp hiển thị.