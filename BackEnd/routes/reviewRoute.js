import express from 'express'
import { addReview, deleteReview, getReviewsByProduct, getReviewCountByProduct, getReviewCountAll } from '../controller/reviewController.js'
import authMiddleware from '../middleware/authMiddleware.js'
import adminAuth from '../middleware/adminAuth.js'

const router = express.Router()

// User add review
router.post('/add', authMiddleware, addReview)
// User xoá review của mình
router.delete('/remove/:id', authMiddleware, deleteReview)
// Admin xem review của sản phẩm
router.get('/product/:productId', getReviewsByProduct)
// Lấy số lượng review cho 1 sản phẩm
router.get('/count/:productId', getReviewCountByProduct)
// Lấy số lượng review cho tất cả sản phẩm
router.get('/count-all', getReviewCountAll)

export default router
