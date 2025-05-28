import express from "express";
import { addProduct, singleProduct, listProduct, removeProduct, updateProduct } from "../controller/productController.js";
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";

const productRouter = express.Router();

productRouter.post("/add", adminAuth, upload.fields([{ name: "image1", maxCount: 1 }, { name: "image2", maxCount: 1 }, { name: "image3", maxCount: 1 }, { name: "image4", maxCount: 1 }]), addProduct);
productRouter.get("/list", listProduct);
productRouter.put("/update/:id", adminAuth, upload.fields([{ name: "image1", maxCount: 1 }, { name: "image2", maxCount: 1 }, { name: "image3", maxCount: 1 }, { name: "image4", maxCount: 1 }]), updateProduct);
productRouter.get("/single/:id", singleProduct);
productRouter.delete("/remove/:id", adminAuth, removeProduct);

export default productRouter
