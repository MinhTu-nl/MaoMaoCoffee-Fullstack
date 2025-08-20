import express from 'express'
import { loginUser, registerUser, adminLogin, listUsers, getUser, validateAdminToken, changePassword } from '../controller/userController.js'
import authMiddleware from '../middleware/authMiddleware.js'
import auth from '../middleware/auth.js'
import adminAuth from '../middleware/adminAuth.js'

const userRouter = express.Router()

// User routes
userRouter.post('/login', loginUser)
userRouter.post('/register', registerUser)
userRouter.get('/get', auth, getUser)
userRouter.put('/change-password', auth, changePassword)

// Admin routes
userRouter.post('/admin', adminLogin)
userRouter.get('/admin/validate', adminAuth, validateAdminToken)
userRouter.get('/list', adminAuth, listUsers)
userRouter.get('/:id', adminAuth, getUser)

export default userRouter

// Ghi chú:
// - /login, /register: public
// - /get và /change-password: user phải có token hợp lệ (middleware `auth` hoặc `authMiddleware`)
// - Các route admin yêu cầu token admin (adminAuth)