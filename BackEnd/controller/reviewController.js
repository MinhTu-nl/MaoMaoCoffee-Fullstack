import Review from '../model/reviewModel.js'
import Product from '../model/productsModel.js'
import mongoose from 'mongoose'
import User from '../model/userModel.js'

// Add review
export const addReview = async (req, res) => {
    try {
        const { productId, rating, comment } = req.body
        const user = req.user._id || req.user.id
        // Kiểm tra đã review chưa
        const existed = await Review.findOne({ user, productId })
        if (existed) return res.status(400).json({ message: 'Bạn đã đánh giá sản phẩm này!' })
        const review = await Review.create({ user, productId, rating, comment })
        res.status(201).json(review)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// Delete review
export const deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id)
        if (!review) return res.status(404).json({ message: 'Không tìm thấy review!' })
        // Chỉ user tạo review mới được xoá
        if (review.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Bạn không có quyền xoá review này!' })
        }
        await review.deleteOne()
        res.json({ message: 'Đã xoá review!' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// Get reviews by product (admin & user)
export const getReviewsByProduct = async (req, res) => {
    try {
        const { productId } = req.params
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: 'productId không hợp lệ!' })
        }
        const reviews = await Review.find({ productId }).populate('user', 'name')
        res.json(reviews)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// Lấy số lượng review cho 1 sản phẩm
export const getReviewCountByProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const count = await Review.countDocuments({ productId });
        res.json({ count });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// Lấy số lượng review cho tất cả sản phẩm
export const getReviewCountAll = async (req, res) => {
    try {
        // Lấy tất cả review, group theo productId
        const counts = await Review.aggregate([
            { $group: { _id: "$productId", count: { $sum: 1 } } }
        ]);
        // Chuyển thành object { productId: count, ... }
        const result = {};
        counts.forEach(item => {
            result[item._id] = item.count;
        });
        res.json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
