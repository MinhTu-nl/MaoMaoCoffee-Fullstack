import express from 'express';
import { addContact, getAllContacts, deleteContact, sendFeedback, getUserContacts } from '../controller/contactController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import adminAuth from '../middleware/adminAuth.js';

const contactRouter = express.Router();

contactRouter.post('/add', authMiddleware, addContact); // User gửi contact
contactRouter.get('/user-contacts', authMiddleware, getUserContacts); // User lấy contactData của mình
contactRouter.get('/list', authMiddleware, getAllContacts); // Admin xem tất cả contact
contactRouter.delete('/delete/:userId/:contactId', authMiddleware, deleteContact); // Admin xoá contact
contactRouter.put('/feedback/:userId/:contactId', adminAuth, authMiddleware, sendFeedback); // Admin gửi phản hồi cho contact


export default contactRouter;
