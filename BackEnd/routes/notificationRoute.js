import express from 'express';
import { getAllNotifications, createNotification, markAsRead, deleteNotification, markAllAsRead, deleteAllNotifications, getUnreadCount, getUserNotifications, markUserNotificationAsRead } from '../controller/notificationController.js';
import adminAuth from '../middleware/adminAuth.js';
import authMiddleware from '../middleware/authMiddleware.js';
import Notification from '../model/notificationModel.js';

const router = express.Router();

// Admin routes
// Lấy tất cả thông báo
router.get('/', adminAuth, getAllNotifications);
// Tạo thông báo mới
router.post('/', adminAuth, createNotification);
// Đánh dấu đã đọc
router.patch('/:id/read', adminAuth, markAsRead);
// Xóa thông báo
router.delete('/:id', adminAuth, deleteNotification);
// Đánh dấu tất cả đã đọc
router.patch('/all/read', adminAuth, markAllAsRead);
// Xóa tất cả thông báo
router.delete('/all', adminAuth, deleteAllNotifications);
// Lấy số lượng chưa đọc (admin)
router.get('/unread/count', adminAuth, getUnreadCount);

// Lấy số lượng chưa đọc cho user
router.get('/user/unread/count', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const count = await Notification.countDocuments({
            'data.userId': userId,
            isRead: false
        });

        res.json({
            success: true,
            count: count
        });
    } catch (error) {
        console.error('Error getting user unread count:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server khi lấy số lượng thông báo chưa đọc'
        });
    }
});

// User routes
// User lấy notifications của mình
router.get('/user', authMiddleware, getUserNotifications);
// User đánh dấu notification đã đọc
router.patch('/user/:notificationId/read', authMiddleware, markUserNotificationAsRead);

export default router; 