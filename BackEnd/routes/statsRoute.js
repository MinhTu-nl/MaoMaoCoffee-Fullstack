import express from 'express';
import { getRevenue, getTopProducts, getCategories, getOrderStatus } from '../controller/statsController.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

// Các endpoint thống kê dành cho Admin (yêu cầu token admin)

// Route lấy dữ liệu doanh thu (yêu cầu token admin)
router.get('/revenue', adminAuth, getRevenue);

// Route lấy dữ liệu top sản phẩm (yêu cầu token admin)
router.get('/top-products', adminAuth, getTopProducts);

// Route lấy dữ liệu phân loại sản phẩm (yêu cầu token admin)
router.get('/categories', adminAuth, getCategories);

// Route lấy dữ liệu trạng thái đơn hàng (yêu cầu token admin)
router.get('/order-status', adminAuth, getOrderStatus);

export default router; 