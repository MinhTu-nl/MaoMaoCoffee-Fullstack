import express from 'express'
import { placeOrder, allOrder, userOrder, updateStatus, updatePaymentStatus, deleteOrder } from '../controller/orderController.js'
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

// Update payment status (requires authentication)
orderRouter.patch('/payment/:orderId', adminAuth, updatePaymentStatus)

// Cancel order (requires user authentication)
orderRouter.delete('/:orderId', verifyToken, deleteOrder)

// Ghi chú:
// - POST /place: body chứa items/amount/address/branchId
// - GET /all: admin lấy tất cả đơn (có thể filter status)
// - GET /user: user lấy đơn của chính mình (dựa vào req.user)
// - PATCH /status/:orderId: admin cập nhật trạng thái đơn
// - DELETE /:orderId: user có thể hủy đơn (tuỳ điều kiện trong controller)

export default orderRouter
