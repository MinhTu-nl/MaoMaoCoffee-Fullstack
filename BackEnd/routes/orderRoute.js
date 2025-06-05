import express from 'express'
import { placeOrder, allOrder, userOrder, updateStatus } from '../controller/orderController.js'
import verifyToken from '../middleware/auth.js'
import adminAuth from '../middleware/adminAuth.js'

const orderRouter = express.Router()

// Place new order (requires authentication)
orderRouter.post('/place', verifyToken, placeOrder)

// Get all orders (requires authentication)
orderRouter.get('/all', adminAuth, allOrder)

// Get user's orders (requires authentication)
orderRouter.get('/user', verifyToken, userOrder)

// Update order status (requires authentication)
orderRouter.patch('/status/:orderId', adminAuth, updateStatus)

export default orderRouter
