import express from 'express';
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

// Admin gửi phản hồi cho contact
export const sendFeedback = async (req, res) => {
    try {
        const { userId, contactId } = req.params;
        const { feedback } = req.body;
        const user = await userModel.findOneAndUpdate(
            { _id: userId, 'contactData._id': contactId },
            { $set: { 'contactData.$.feedback': feedback } },
            { new: true }
        );
        if (!user) return res.status(404).json({ success: false, message: 'Contact not found' });
        res.json({ success: true, message: 'Feedback sent', feedback });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// User lấy contactData của mình (bao gồm phản hồi từ admin)
export const getUserContacts = async (req, res) => {
    try {
        const userId = req.user.id;

        // Lấy user và chỉ lấy contactData
        const user = await userModel.findById(userId, { contactData: 1, name: 1, email: 1 });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Sắp xếp contactData theo thời gian mới nhất trước
        const sortedContacts = user.contactData.sort((a, b) => new Date(b.date) - new Date(a.date));

        res.json({
            success: true,
            contacts: sortedContacts,
            userInfo: {
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Error fetching user contacts:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching contacts'
        });
    }
};
