import express from 'express'
import authUser from '../middleware/auth.js'
import { addToCart, getUserCart, updateCart, removeFromCart, clearCart } from '../controller/cartController.js'

const cartRouter = express.Router()

// Add to cart
cartRouter.post('/add', authUser, addToCart)

// Get cart
cartRouter.get('/get', authUser, getUserCart)

// Update cart
cartRouter.put('/update', authUser, updateCart)

// Remove item from cart
cartRouter.delete('/remove', authUser, removeFromCart)

// Clear entire cart
cartRouter.delete('/clear', authUser, clearCart)

export default cartRouter