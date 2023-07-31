const express = require('express')
require('dotenv').config()
const connectToMongoDB = require('./config/connectDB')

// Importing Routes
const userRoute = require('./routes/user')
const userAuthRoute = require('./routes/userAuth')
const restaurantRoute = require('./routes/restaurant')
const restaurantAuthRoute = require('./routes/restaurantAuth')
const foodRoute = require('./routes/food')
const orderRoute = require('./routes/order')
const deliveryBoyAuthRoute = require('./routes/deliveryBoyAuth')
const deliveryBoyRoute = require('./routes/deliveryBoy')
const verifyRoute = require('./routes/verify')

const startApp = async () => {
    const app = express()

    // Database Connection
    await connectToMongoDB()

    // Middlewares
    app.use(express.json())
    app.use('/api/user', userRoute)
    app.use('/api/user', userAuthRoute)
    app.use('/api/restaurant', restaurantRoute)
    app.use('/api/restaurant', restaurantAuthRoute)
    app.use('/api/food', foodRoute)
    app.use('/api/order', orderRoute)
    app.use('/api/deliveryboy', deliveryBoyAuthRoute)
    app.use('/api/deliveryboy', deliveryBoyRoute)
    app.use('/api/verify', verifyRoute)

    app.listen(process.env.PORT, () => console.log(`App Running On Port: ${process.env.PORT}`))
}

startApp()