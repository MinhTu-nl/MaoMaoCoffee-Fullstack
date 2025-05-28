import userModel from "../model/userModel.js"

const addToCart = async (req, res) => {
    try {
        const { userId, itemId, sizes } = req.body

        // Validate input
        if (!userId || !itemId || !sizes) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            })
        }

        const userData = await userModel.findById(userId)
        if (!userData) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        let cartData = userData.cartData || {}

        // Add to cart with validation
        if (cartData[itemId]) {
            if (cartData[itemId][sizes]) {
                cartData[itemId][sizes] += 1
            } else {
                cartData[itemId][sizes] = 1
            }
        } else {
            cartData[itemId] = { [sizes]: 1 }
        }

        await userModel.findByIdAndUpdate(userId, { cartData })
        res.json({
            success: true,
            message: "Added To Cart"
        })
    } catch (e) {
        console.error("Add to cart error:", e)
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

const updateCart = async (req, res) => {
    try {
        const { userId, itemId, sizes, quantity } = req.body

        // Validate input
        if (!userId || !itemId || !sizes || quantity === undefined) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            })
        }

        // Validate quantity
        if (quantity < 0) {
            return res.status(400).json({
                success: false,
                message: "Quantity cannot be negative"
            })
        }

        const userData = await userModel.findById(userId)
        if (!userData) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        let cartData = userData.cartData || {}

        // Check if item exists in cart
        if (!cartData[itemId] || !cartData[itemId][sizes]) {
            return res.status(404).json({
                success: false,
                message: "Item not found in cart"
            })
        }

        // Update quantity
        if (quantity === 0) {
            delete cartData[itemId][sizes]
            if (Object.keys(cartData[itemId]).length === 0) {
                delete cartData[itemId]
            }
        } else {
            cartData[itemId][sizes] = quantity
        }

        await userModel.findByIdAndUpdate(userId, { cartData })
        res.json({
            success: true,
            message: "Cart updated successfully"
        })
    } catch (e) {
        console.error("Update cart error:", e)
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

const getUserCart = async (req, res) => {
    try {
        const { userId } = req.body

        // Validate input
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            })
        }

        const userData = await userModel.findById(userId)
        if (!userData) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        const cartData = userData.cartData || {}
        res.json({
            success: true,
            cartData,
            message: Object.keys(cartData).length === 0 ? "Cart is empty" : "Cart retrieved successfully"
        })
    } catch (e) {
        console.error("Get user cart error:", e)
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

const removeFromCart = async (req, res) => {
    try {
        const { userId, itemId, sizes } = req.body

        // Validate input
        if (!userId || !itemId || !sizes) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            })
        }

        const userData = await userModel.findById(userId)
        if (!userData) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        let cartData = userData.cartData || {}

        // Check if item exists in cart
        if (!cartData[itemId] || !cartData[itemId][sizes]) {
            return res.status(404).json({
                success: false,
                message: "Item not found in cart"
            })
        }

        // Remove item
        delete cartData[itemId][sizes]
        if (Object.keys(cartData[itemId]).length === 0) {
            delete cartData[itemId]
        }

        await userModel.findByIdAndUpdate(userId, { cartData })
        res.json({
            success: true,
            message: "Item removed from cart successfully"
        })
    } catch (e) {
        console.error("Remove from cart error:", e)
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

const clearCart = async (req, res) => {
    try {
        const { userId } = req.body

        // Validate input
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            })
        }

        const userData = await userModel.findById(userId)
        if (!userData) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        await userModel.findByIdAndUpdate(userId, { cartData: {} })
        res.json({
            success: true,
            message: "Cart cleared successfully"
        })
    } catch (e) {
        console.error("Clear cart error:", e)
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

export { addToCart, updateCart, getUserCart, removeFromCart, clearCart }