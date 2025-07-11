import userModel from '../model/userModel.js';
import Notification from '../model/notificationModel.js';

// User gửi contact
export const addContact = async (req, res) => {
    try {
        const { name, email, message } = req.body;
        const userId = req.user.id;
        const contact = { name, email, message, date: new Date(), _id: new Date().getTime().toString() };

        await userModel.findByIdAndUpdate(
            userId,
            { $push: { contactData: contact } }
        );
        // Lấy thông tin user
        const user = await userModel.findById(userId);
        // Tạo notification cho admin
        await Notification.create({
            type: 'contact',
            message: `Người dùng ${user?.name || name} (${user?.email || email}) vừa gửi liên hệ`,
            data: { userId, name: user?.name || name, email: user?.email || email }
        });
        res.json({ success: true, message: 'Contact sent successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Admin xem tất cả contact của mọi user
export const getAllContacts = async (req, res) => {
    try {
        // Chỉ admin mới được phép
        if (!req.user.isAdmin) return res.status(403).json({ success: false, message: 'Forbidden' });

        // Lấy tất cả contactData từ tất cả user
        const users = await userModel.find({}, { contactData: 1, _id: 1, name: 1, email: 1 });
        // Gom tất cả contact lại thành 1 mảng
        const allContacts = [];
        users.forEach(user => {
            user.contactData.forEach(contact => {
                allContacts.push({
                    ...contact._doc,
                    userId: user._id,
                    userName: user.name,
                    userEmail: user.email
                });
            });
        });

        res.json({ success: true, contacts: allContacts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Admin xoá contact theo _id và userId
export const deleteContact = async (req, res) => {
    try {
        if (!req.user.isAdmin) return res.status(403).json({ success: false, message: 'Forbidden' });

        const { userId, contactId } = req.params;
        await userModel.findByIdAndUpdate(
            userId,
            { $pull: { contactData: { _id: contactId } } }
        );
        res.json({ success: true, message: 'Contact deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
