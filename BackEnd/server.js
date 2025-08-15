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

connectDB()
connectCloudinary()

// midlleware
app.use(express.json())
app.use(cors())

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
    res.send('Im Minh Tú')
})

app.listen(port, () => console.log(`Server is running on port: ${port}`))