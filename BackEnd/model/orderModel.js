import mongoose from "mongoose"

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true // Add index for faster queries
    },
    items: {
        type: Array,
        required: true,
        validate: {
            validator: function (v) {
                return v.length > 0;
            },
            message: 'Order must have at least one item'
        }
    },
    amount: {
        type: Number,
        required: true,
        min: [0, 'Amount cannot be negative']
    },
    address: {
        type: Object,
        required: true,
        validate: {
            validator: function (v) {
                return v.street && v.city && v.country;
            },
            message: 'Address must include street, city and country'
        }
    },
    status: {
        type: String,
        required: true,
        default: "Order Placed",
    },
    paymentMethod: {
        type: String,
        required: true,
    },
    payment: {
        type: Boolean,
        required: true,
        default: false
    },
    trackingNumber: {
        type: String,
        sparse: true
    },
    deliveryStatus: {
        type: String,
        default: 'Pending'
    },
    date: {
        type: Number,
        required: true
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields
})

const orderModel = mongoose.models.order || mongoose.model('order', orderSchema)
export default orderModel;