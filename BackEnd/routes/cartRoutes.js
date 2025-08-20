import express from 'express';
import { addToCart, updateCart, getUserCart, removeFromCart, clearCart } from '../controller/cartController.js';
import verifyToken from '../middleware/auth.js';

const cartRouter = express.Router();

// Áp dụng middleware xác thực cho tất cả các routes trong cart
// Tất cả endpoint dưới đây đều yêu cầu user đã đăng nhập (token hợp lệ)
cartRouter.use(verifyToken);

// Cart routes
// POST /add - Thêm sản phẩm vào giỏ hàng (body chứa productId, size, quantity...)
cartRouter.post('/add', addToCart);
// POST /update - Cập nhật số lượng hoặc thuộc tính sản phẩm trong giỏ
cartRouter.post('/update', updateCart);
// GET /get - Lấy thông tin giỏ hàng của user hiện tại
cartRouter.get('/get', getUserCart);
// POST /remove - Xóa một sản phẩm khỏi giỏ
cartRouter.post('/remove', removeFromCart);
// POST /clear - Xóa toàn bộ giỏ hàng
cartRouter.post('/clear', clearCart);

export default cartRouter; 