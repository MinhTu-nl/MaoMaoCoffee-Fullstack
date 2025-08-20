import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Review = mongoose.model('Review', reviewSchema)
export default Review

// Ghi chú:
// - Review tham chiếu tới user và product.
// - `rating` giới hạn từ 1..5.
// - `createdAt` lưu thời điểm tạo review.
