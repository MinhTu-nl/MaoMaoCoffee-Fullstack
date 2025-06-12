import orderModel from "../model/orderModel.js"
import userModel from "../model/userModel.js"
import ProductModel from "../model/productsModel.js"
import mongoose from "mongoose"

const placeOrder = async (req, res) => {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const { items, amount, address } = req.body
        const userId = req.user.id // Get userId from authenticated user

        // Validate input data
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid items data"
            })
        }

        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid amount"
            })
        }

        if (!address || !address.street || !address.city || !address.country) {
            return res.status(400).json({
                success: false,
                message: "Invalid address data"
            })
        }

        // Check if user exists
        const user = await userModel.findById(userId)
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        // Fetch product details for each item to include category
        const itemsWithCategory = await Promise.all(items.map(async (item) => {
            const product = await ProductModel.findById(item.productId); // Assuming item has productId
            if (!product) {
                throw new Error(`Product with ID ${item.productId} not found`);
            }
            return { ...item, category: product.category, name: product.name, price: product.price.get(item.size || 'M'), images: product.images };
        }));

        const orderData = {
            userId,
            items: itemsWithCategory,
            address,
            amount,
            paymentMethod: 'COD',
            payment: false,
            date: Date.now(),
            status: "Order Placed",
            deliveryStatus: "Pending"
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save({ session })

        // Clear user's cart after successful order
        await userModel.findByIdAndUpdate(
            userId,
            { cartData: {} },
            { session }
        )

        await session.commitTransaction()

        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            orderId: newOrder._id
        })
    } catch (error) {
        await session.abortTransaction()

        console.error("Order placement error:", error)

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: "Invalid order data",
                errors: Object.values(error.errors).map(err => err.message)
            })
        }

        res.status(500).json({
            success: false,
            message: "Failed to place order",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        })
    } finally {
        session.endSession()
    }
}

const allOrder = async (req, res) => {
    try {
        const status = req.query.status

        // Build query
        const query = {}
        if (status) {
            query.status = status
        }

        // Get all orders with user information
        const orders = await orderModel
            .find(query)
            .sort({ date: -1 }) // Sort by date, newest first
            .populate({
                path: 'userId',
                select: 'name email phone' // Only select necessary user fields
            })

        /* Advanced options (commented out):
        // Pagination
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const skip = (page - 1) * limit
        
        // Sorting options
        const sortBy = req.query.sortBy || 'date'
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1
        
        // Additional filters
        const startDate = req.query.startDate
        const endDate = req.query.endDate
        if (startDate && endDate) {
            query.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        }
        */

        res.status(200).json({
            success: true,
            data: {
                orders,
                totalOrders: orders.length
            }
        })
    } catch (error) {
        console.error("Error fetching orders:", error)

        res.status(500).json({
            success: false,
            message: "Failed to fetch orders",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        })
    }
}

const userOrder = async (req, res) => {
    try {
        const userId = req.user.id // Get userId from authenticated user
        const status = req.query.status

        // Build query
        const query = { userId }
        if (status) {
            query.status = status
        }

        // Get user's orders
        const orders = await orderModel
            .find(query)
            .sort({ date: -1 }) // Sort by date, newest first

        /* Advanced options (commented out):
        // Pagination
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const skip = (page - 1) * limit
        
        // Date range filter
        const startDate = req.query.startDate
        const endDate = req.query.endDate
        if (startDate && endDate) {
            query.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        }
        */

        res.status(200).json({
            success: true,
            data: {
                orders,
                totalOrders: orders.length
            }
        })
    } catch (error) {
        console.error("Error fetching user orders:", error)

        res.status(500).json({
            success: false,
            message: "Failed to fetch user orders",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        })
    }
}

const updateStatus = async (req, res) => {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const { orderId } = req.params
        const { status, deliveryStatus } = req.body

        // Validate input
        if (!status && !deliveryStatus) {
            return res.status(400).json({
                success: false,
                message: "At least one status must be provided"
            })
        }

        // Find order
        const order = await orderModel.findById(orderId)
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            })
        }

        // Prepare update data
        const updateData = {}
        if (status) {
            updateData.status = status
        }
        if (deliveryStatus) {
            updateData.deliveryStatus = deliveryStatus
        }

        // Update order
        const updatedOrder = await orderModel.findByIdAndUpdate(
            orderId,
            updateData,
            {
                new: true, // Return updated document
                session
            }
        )

        await session.commitTransaction()

        res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            data: updatedOrder
        })
    } catch (error) {
        await session.abortTransaction()

        console.error("Error updating order status:", error)

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: "Invalid status data",
                errors: Object.values(error.errors).map(err => err.message)
            })
        }

        res.status(500).json({
            success: false,
            message: "Failed to update order status",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        })
    } finally {
        session.endSession()
    }
}

export { placeOrder, allOrder, userOrder, updateStatus }