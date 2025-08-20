import express from "express";
import { addProduct, singleProduct, listProduct, removeProduct, updateProduct } from "../controller/productController.js";
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";

const productRouter = express.Router();

// Thêm product (chỉ admin). upload.fields định nghĩa các trường image1..image4
productRouter.post("/add", adminAuth, upload.fields([{ name: "image1", maxCount: 1 }, { name: "image2", maxCount: 1 }, { name: "image3", maxCount: 1 }, { name: "image4", maxCount: 1 }]), addProduct);

// Danh sách product (public) - hỗ trợ query params để lọc/pagination trong controller
productRouter.get("/list", listProduct);

// Cập nhật product (chỉ admin) - có thể upload ảnh mới
productRouter.put("/update/:id", adminAuth, upload.fields([{ name: "image1", maxCount: 1 }, { name: "image2", maxCount: 1 }, { name: "image3", maxCount: 1 }, { name: "image4", maxCount: 1 }]), updateProduct);

// Lấy 1 sản phẩm theo id
productRouter.get("/single/:id", singleProduct);

// Xóa sản phẩm (chỉ admin)
productRouter.delete("/remove/:id", adminAuth, removeProduct);

export default productRouter
