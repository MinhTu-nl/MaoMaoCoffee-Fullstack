import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import helmet from 'helmet'

import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoutes.js'
import orderRouter from './routes/orderRoute.js'
import statsRouter from './routes/statsRoute.js'
import branchRouter from './routes/branchRoute.js'
import contactRouter from './routes/contactRoute.js'
import reviewRouter from './routes/reviewRoute.js'
import notificationRouter from './routes/notificationRoute.js'


// app config
const app = express()
const port = process.env.PORT || 4000

// helmet
app.use(helmet());

// Connect to databases
connectDB()
connectCloudinary()

// middleware
app.use(express.json())
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
}))

//user
app.use('/api/user', userRouter)

//product
app.use('/api/product', productRouter)

//order
app.use('/api/order', orderRouter)

//cart
app.use('/api/cart', cartRouter)

//stats
app.use('/api/stats', statsRouter)

//branch
app.use('/api/branch', branchRouter)

//conatact data
app.use('/api/contact', contactRouter)

//review
app.use('/api/review', reviewRouter)

//notification
app.use('/api/notification', notificationRouter)

app.get('/', (req, res) => {
    res.json({ message: 'MaoMao Backend API is running!' })
})

app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    })
})

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' })
})

// Only start a local server during development. Vercel will handle the
// request lifecycle in production using the exported handler.
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => console.log(`Server is running on port: ${port}`))
}

export default app