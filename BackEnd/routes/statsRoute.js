import express from 'express';
import { getRevenue, getTopProducts, getCategories, getOrderStatus } from '../controller/statsController.js';

const router = express.Router();

// Route lấy dữ liệu doanh thu
router.get('/revenue', getRevenue);

// Route lấy dữ liệu top sản phẩm
router.get('/top-products', getTopProducts);

// Route lấy dữ liệu phân loại sản phẩm
router.get('/categories', getCategories);

// Route lấy dữ liệu trạng thái đơn hàng
router.get('/order-status', getOrderStatus);

export default router; 