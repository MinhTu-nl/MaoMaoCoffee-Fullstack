import express from 'express';
import { addToCart, updateCart, getUserCart, removeFromCart, clearCart } from '../controller/cartController.js';
import verifyToken from '../middleware/auth.js';

const cartRouter = express.Router();

// Áp dụng middleware xác thực cho tất cả các routes
cartRouter.use(verifyToken);

// Cart routes
cartRouter.post('/add', addToCart);        // Thêm sản phẩm vào giỏ hàng
cartRouter.post('/update', updateCart);    // Cập nhật số lượng sản phẩm
cartRouter.get('/get', getUserCart);       // Lấy thông tin giỏ hàng
cartRouter.post('/remove', removeFromCart); // Xóa sản phẩm khỏi giỏ hàng
cartRouter.post('/clear', clearCart);      // Xóa toàn bộ giỏ hàng

export default cartRouter; 