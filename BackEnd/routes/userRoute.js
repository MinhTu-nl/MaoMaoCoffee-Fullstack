import express from 'express'
import { loginUser, registerUser, adminLogin, listUsers, getUser, validateAdminToken, changePassword } from '../controller/userController.js'
import authMiddleware from '../middleware/authMiddleware.js'
import auth from '../middleware/auth.js'

const userRouter = express.Router()

// User routes
userRouter.post('/login', loginUser)
userRouter.post('/register', registerUser)
userRouter.get('/get', auth, getUser)
userRouter.put('/change-password', auth, changePassword)

// Admin routes
userRouter.post('/admin', adminLogin)
userRouter.get('/admin/validate', authMiddleware, validateAdminToken)
userRouter.get('/list', authMiddleware, listUsers)
userRouter.get('/:id', authMiddleware, getUser)

export default userRouter