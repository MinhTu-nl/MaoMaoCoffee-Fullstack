import express from 'express'
import { loginUser, registerUser, adminLogin } from '../controller/userController.js'

const userRouter = express.Router()

userRouter.post('/login', loginUser)
userRouter.post('/resgister', registerUser)
userRouter.post('/admin', adminLogin)

export default userRouter