import express from 'express'
import { loginUser, registerUser, adminLogin, listUsers } from '../controller/userController.js'

const userRouter = express.Router()

userRouter.post('/login', loginUser)
userRouter.post('/resgister', registerUser)
userRouter.post('/admin', adminLogin)
userRouter.get('/list', listUsers)
export default userRouter