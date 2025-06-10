import express from 'express'
import { loginUser, registerUser, adminLogin, listUsers, getUser } from '../controller/userController.js'
import authMiddleware from '../middleware/authMiddleware.js'

const userRouter = express.Router()

userRouter.post('/login', loginUser)
userRouter.post('/resgister', registerUser)
userRouter.post('/admin', adminLogin)
userRouter.get('/list', listUsers)
userRouter.get('/get', authMiddleware, getUser)
export default userRouter