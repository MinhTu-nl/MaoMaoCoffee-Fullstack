import express from 'express';
import { addContact, getAllContacts, deleteContact } from '../controller/contactController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const contactRouter = express.Router();

contactRouter.post('/add', authMiddleware, addContact); // User gửi contact
contactRouter.get('/list', authMiddleware, getAllContacts); // Admin xem tất cả contact
contactRouter.delete('/delete/:userId/:contactId', authMiddleware, deleteContact); // Admin xoá contact

export default contactRouter;
