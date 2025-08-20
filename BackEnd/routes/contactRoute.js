import express from 'express';
import { addContact, getAllContacts, deleteContact, sendFeedback, getUserContacts } from '../controller/contactController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import adminAuth from '../middleware/adminAuth.js';

const contactRouter = express.Router();
// User gửi contact: POST /add (body: { name, email, message })
contactRouter.post('/add', authMiddleware, addContact);

// User lấy contactData của mình: GET /user-contacts
contactRouter.get('/user-contacts', authMiddleware, getUserContacts);

// Admin xem tất cả contact: GET /list (yêu cầu token admin)
contactRouter.get('/list', authMiddleware, getAllContacts);

// Admin xoá contact: DELETE /delete/:userId/:contactId
contactRouter.delete('/delete/:userId/:contactId', authMiddleware, deleteContact);

// Admin gửi phản hồi cho contact: PUT /feedback/:userId/:contactId (yêu cầu admin)
contactRouter.put('/feedback/:userId/:contactId', adminAuth, authMiddleware, sendFeedback);

export default contactRouter;
