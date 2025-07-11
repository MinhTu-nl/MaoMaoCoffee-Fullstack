import Notification from '../model/notificationModel.js';

// Lấy tất cả thông báo (admin)
export const getAllNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find().sort({ createdAt: -1 });
        res.status(200).json(notifications);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Tạo thông báo mới (admin)
export const createNotification = async (req, res) => {
    try {
        const { type, message, data } = req.body;
        const notification = new Notification({ type, message, data });
        await notification.save();
        res.status(201).json(notification);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Đánh dấu đã đọc (admin)
export const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await Notification.findByIdAndUpdate(id, { isRead: true }, { new: true });
        if (!notification) return res.status(404).json({ error: 'Notification not found' });
        res.status(200).json(notification);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Xóa thông báo (admin)
export const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await Notification.findByIdAndDelete(id);
        if (!notification) return res.status(404).json({ error: 'Notification not found' });
        res.status(200).json({ message: 'Notification deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Đánh dấu tất cả đã đọc (admin)
export const markAllAsRead = async (req, res) => {
    try {
        // Sử dụng $set để đảm bảo update đúng chuẩn MongoDB
        const result = await Notification.updateMany({ isRead: false }, { $set: { isRead: true } });
        console.log('Update result:', result);
        res.status(200).json({ message: 'Tất cả thông báo đã được đánh dấu là đã đọc.' });
    } catch (err) {
        console.error('Mark all as read error:', err);
        res.status(500).json({ error: err.message, stack: err.stack });
    }
};

// Xóa tất cả thông báo (admin)
export const deleteAllNotifications = async (req, res) => {
    try {
        await Notification.deleteMany({});
        res.status(200).json({ message: 'Đã xóa tất cả thông báo.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Lấy số lượng thông báo chưa đọc (admin)
export const getUnreadCount = async (req, res) => {
    try {
        const count = await Notification.countDocuments({ isRead: false });
        res.status(200).json({ unread: count });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}; 