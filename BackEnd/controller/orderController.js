import orderModel from "../model/orderModel.js"
import userModel from "../model/userModel.js"
import ProductModel from "../model/productsModel.js"
import mongoose from "mongoose"
import Notification from '../model/notificationModel.js'

const placeOrder = async (req, res) => {
    let session;
    try {
        // Try to start a transaction, but continue without it if not available
        try {
            session = await mongoose.startSession();
            session.startTransaction();
        } catch (error) {
            console.warn('MongoDB transactions not available, proceeding without transaction');
        }

        const { items, amount, address, branchId } = req.body
        const userId = req.user.id // Get userId from authenticated user

        console.log('Received order request:', { userId, items, amount, address, branchId });

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

        // Validate address data more explicitly
        if (!address || typeof address !== 'object' || !address.street || !address.city || !address.country) {
            console.error('Error: Invalid address data.', address);
            return res.status(400).json({
                success: false,
                message: "Invalid address data. Street, city, and country are required."
            })
        }

        if (!branchId) {
            console.error('Error: branchId is missing.');
            return res.status(400).json({
                success: false,
                message: "Branch ID is required"
            })
        }

        // Check if branchId is a valid ObjectId before using it in queries
        if (!mongoose.Types.ObjectId.isValid(branchId)) {
            console.error('Error: Invalid branchId format.', branchId);
            return res.status(400).json({
                success: false,
                message: "Invalid Branch ID format"
            });
        }

        // Check if user exists
        const user = await userModel.findById(userId)
        if (!user) {
            console.error('Error: User not found for userId', userId);
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        // Fetch product details for each item to include category
        const itemsWithCategory = await Promise.all(items.map(async (item) => {
            console.log(`Fetching product for item ID: ${item.productId}, size: ${item.size}`);
            const product = await ProductModel.findById(item.productId);

            if (!product) {
                console.error(`Product with ID ${item.productId} not found.`);
                throw new Error(`Product with ID ${item.productId} not found`);
            }

            let price;
            if (product.price instanceof Map) {
                price = product.price.get(item.size);
                console.log(`Product ${item.productId} has price as Map. Price for size ${item.size}: ${price}`);
            } else if (typeof product.price === 'object' && product.price !== null) {
                // Handle plain object prices if not a Map (e.g., from direct JSON import)
                price = product.price[item.size];
                console.log(`Product ${item.productId} has price as plain object. Price for size ${item.size}: ${price}`);
            } else {
                price = product.price; // Assume a single price if not an object/Map
                console.log(`Product ${item.productId} has single price: ${price}`);
            }

            if (price === undefined || price === null || isNaN(price)) {
                console.error(`Price not found or invalid for size ${item.size} of product ${item.productId}. Product price object:`, product.price);
                throw new Error(`Price not found or invalid for size ${item.size} of product ${item.productId}`);
            }

            return {
                ...item,
                category: product.category,
                name: product.name,
                price: price,
                images: product.images
            };
        }));

        const orderData = {
            userId,
            items: itemsWithCategory,
            address,
            amount,
            branch: branchId,
            paymentMethod: 'COD',
            payment: false,
            date: Date.now(),
            status: "Order Placed",
            deliveryStatus: "Pending"
        }

        console.log('Order data to be saved:', JSON.stringify(orderData, null, 2));

        const newOrder = new orderModel(orderData)
        await newOrder.save(session ? { session } : {})

        // Tạo notification cho admin
        await Notification.create({
            type: 'order',
            message: `Người dùng ${user.name} (${user.email}) vừa đặt hàng mới`,
            data: { orderId: newOrder._id, userId: user._id, name: user.name, email: user.email }
        });

        // Clear user's cart after successful order
        await userModel.findByIdAndUpdate(
            userId,
            { cartData: {} },
            session ? { session } : {}
        )

        if (session) {
            await session.commitTransaction()
        }

        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            orderId: newOrder._id
        })
    } catch (error) {
        if (session) {
            await session.abortTransaction()
        }

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
            message: error.message || "Failed to place order",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        })
    } finally {
        if (session) {
            session.endSession()
        }
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

        // Get all orders with user and branch information
        const orders = await orderModel
            .find(query)
            .sort({ date: -1 }) // Sort by date, newest first
            .populate({
                path: 'userId',
                select: 'name email phone' // Only select necessary user fields
            })
            .populate({
                path: 'branch',
                select: 'name location' // Select branch information
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

        // Get user's orders with branch information
        const orders = await orderModel
            .find(query)
            .populate({
                path: 'branch',
                select: 'name location'
            })

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
    let session;
    try {
        // Try to start a transaction, but continue without it if not available
        try {
            session = await mongoose.startSession();
            session.startTransaction();
        } catch (error) {
            console.warn('MongoDB transactions not available, proceeding without transaction');
        }

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
                session: session ? session : undefined
            }
        )

        if (session) {
            await session.commitTransaction()
        }

        res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            data: updatedOrder
        })
    } catch (error) {
        if (session) {
            await session.abortTransaction()
        }

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
        if (session) {
            session.endSession()
        }
    }
}

const updatePaymentStatus = async (req, res) => {
    let session;
    try {
        // Try to start a transaction, but continue without it if not available
        try {
            session = await mongoose.startSession();
            session.startTransaction();
        } catch (error) {
            console.warn('MongoDB transactions not available, proceeding without transaction');
        }

        const { orderId } = req.params
        const { payment } = req.body

        // Validate input
        if (typeof payment !== 'boolean') {
            return res.status(400).json({
                success: false,
                message: "Payment status must be a boolean value"
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

        // Update order payment status
        const updatedOrder = await orderModel.findByIdAndUpdate(
            orderId,
            { payment },
            {
                new: true,
                session: session ? session : undefined
            }
        )

        if (session) {
            await session.commitTransaction()
        }

        res.status(200).json({
            success: true,
            message: `Order payment status updated to ${payment ? 'paid' : 'unpaid'}`,
            data: updatedOrder
        })
    } catch (error) {
        if (session) {
            await session.abortTransaction()
        }

        console.error("Error updating payment status:", error)

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: "Invalid payment status data",
                errors: Object.values(error.errors).map(err => err.message)
            })
        }

        res.status(500).json({
            success: false,
            message: "Failed to update payment status",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        })
    } finally {
        if (session) {
            session.endSession()
        }
    }
}

const deleteOrder = async (req, res) => {
    let session;
    try {
        // Try to start a transaction, but continue without it if not available
        try {
            session = await mongoose.startSession();
            session.startTransaction();
        } catch (error) {
            console.warn('MongoDB transactions not available, proceeding without transaction');
        }

        const { orderId } = req.params
        const userId = req.user.id // Get userId from authenticated user

        // Find order
        const order = await orderModel.findById(orderId)

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            })
        }

        // Check if user is authorized to delete this order
        if (order.userId !== userId && !req.user.isAdmin) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to cancel this order"
            })
        }

        // Check if order can be cancelled
        const nonCancellableStatuses = ["Delivered", "Shipped", "Processing"]
        if (nonCancellableStatuses.includes(order.status)) {
            return res.status(400).json({
                success: false,
                message: `Cannot cancel order in ${order.status} status`
            })
        }

        // Delete order
        await orderModel.findByIdAndDelete(orderId, session ? { session } : {})

        if (session) {
            await session.commitTransaction()
        }

        res.status(200).json({
            success: true,
            message: "Order cancelled successfully"
        })
    } catch (error) {
        if (session) {
            await session.abortTransaction()
        }

        console.error("Error cancelling order:", error)

        res.status(500).json({
            success: false,
            message: "Failed to cancel order",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        })
    } finally {
        if (session) {
            session.endSession()
        }
    }
}

export { placeOrder, allOrder, userOrder, updateStatus, updatePaymentStatus, deleteOrder }