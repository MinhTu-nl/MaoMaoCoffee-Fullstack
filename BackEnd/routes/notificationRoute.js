import express from 'express';
import { getAllNotifications, createNotification, markAsRead, deleteNotification, markAllAsRead, deleteAllNotifications, getUnreadCount } from '../controller/notificationController.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

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
// Lấy số lượng chưa đọc
router.get('/unread/count', adminAuth, getUnreadCount);

export default router; 