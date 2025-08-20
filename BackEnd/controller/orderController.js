import orderModel from "../model/orderModel.js"
import userModel from "../model/userModel.js"
import ProductModel from "../model/productsModel.js"
import mongoose from "mongoose"
import Notification from '../model/notificationModel.js'

const placeOrder = async (req, res) => {
    let session;
    try {
        // Cố gắng bắt đầu transaction (nếu MongoDB cluster hỗ trợ), nếu không thì tiếp tục không transaction.
        try {
            session = await mongoose.startSession();
            session.startTransaction();
        } catch (error) {
            // Một số môi trường (ví dụ: free-tier MongoDB Atlas hoặc cấu hình cục bộ) không hỗ trợ transaction.
            // Trong trường hợp đó, ta vẫn cho phép tiếp tục nhưng log cảnh báo.
            console.warn('MongoDB transactions not available, proceeding without transaction');
        }

        const { items, amount, address, branchId } = req.body
        const userId = req.user.id // Lấy userId từ token đã được middleware gán

        console.log('Received order request:', { userId, items, amount, address, branchId });

        // --- VALIDATIONS ---
        // Kiểm tra items phải là mảng và không rỗng
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid items data"
            })
        }

        // Kiểm tra amount hợp lệ
        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid amount"
            })
        }

        // Kiểm tra address có trường cần thiết
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

        // Kiểm tra branchId hợp lệ theo ObjectId
        if (!mongoose.Types.ObjectId.isValid(branchId)) {
            console.error('Error: Invalid branchId format.', branchId);
            return res.status(400).json({
                success: false,
                message: "Invalid Branch ID format"
            });
        }

        // Kiểm tra user tồn tại
        const user = await userModel.findById(userId)
        if (!user) {
            console.error('Error: User not found for userId', userId);
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        // --- LẤY THÔNG TIN SẢN PHẨM VÀ XÁC NHẬN GIÁ ---
        // Với mỗi item, lấy product để xác nhận category, images và giá tương ứng với size.
        // Đặc biệt: model product có thể lưu price dưới dạng Map (khi lưu từ client) hoặc object.
        const itemsWithCategory = await Promise.all(items.map(async (item) => {
            console.log(`Fetching product for item ID: ${item.productId}, size: ${item.size}`);
            const product = await ProductModel.findById(item.productId);

            if (!product) {
                console.error(`Product with ID ${item.productId} not found.`);
                throw new Error(`Product with ID ${item.productId} not found`);
            }

            let price;
            if (product.price instanceof Map) {
                // Nếu price là Map, dùng .get(size)
                price = product.price.get(item.size);
                console.log(`Product ${item.productId} has price as Map. Price for size ${item.size}: ${price}`);
            } else if (typeof product.price === 'object' && product.price !== null) {
                // Nếu price là object (ví dụ khi chuyển đổi), lấy theo key size
                price = product.price[item.size];
                console.log(`Product ${item.productId} has price as plain object. Price for size ${item.size}: ${price}`);
            } else {
                // Nếu không có object/Map, coi như giá cố định cho mọi size
                price = product.price; // Assume a single price if not an object/Map
                console.log(`Product ${item.productId} has single price: ${price}`);
            }

            // Nếu không tìm thấy giá hợp lệ thì throw để abort order
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

        // Tạo object order theo schema
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

        // Lưu order; nếu có session thì truyền vào để transaction hoạt động
        const newOrder = new orderModel(orderData)
        await newOrder.save(session ? { session } : {})

        // Tạo notification cho admin (side-effect)
        await Notification.create({
            type: 'order',
            message: `Người dùng ${user.name} (${user.email}) vừa đặt hàng mới`,
            data: { orderId: newOrder._id, userId: user._id, name: user.name, email: user.email }
        });

        // Xóa giỏ hàng của user sau khi đặt hàng thành công
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
        // Nếu có session, rollback transaction
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

        // Prepare update data with forward-only status progression
        const updateData = {}
        if (status) {
            // Enforce allowed forward-only progress and no repetition
            const allowedStatuses = [
                "Order Placed",
                "Packing",
                "Shipped",
                "Out for delivery",
                "Delivered"
            ]

            if (!allowedStatuses.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid status value"
                })
            }

            const currentIndex = allowedStatuses.indexOf(order.status)
            const newIndex = allowedStatuses.indexOf(status)

            // Disallow staying the same or moving backwards
            if (newIndex <= currentIndex) {
                return res.status(400).json({
                    success: false,
                    message: "Không thể cập nhật về trạng thái trước đó hoặc trùng với trạng thái hiện tại. Chỉ được phép cập nhật tiến về phía trước."
                })
            }

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