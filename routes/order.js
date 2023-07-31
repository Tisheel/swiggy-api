const router = require('express').Router()

// Controller
const { createOrder, cancelOrder, updateOrder } = require('../controllers/orderController')

// Routes
router.post('/create/:userId', createOrder)
router.delete('/delete/:id', cancelOrder)
router.patch('/update/:id', updateOrder)

module.exports = router