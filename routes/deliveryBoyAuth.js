const router = require('express').Router()

// Controllers
const { loginDeliveryBoy, registerDeliveryBoy } = require('../controllers/deliveryBoyController')

// Routes
router.post('/register', registerDeliveryBoy)
router.post('/login', loginDeliveryBoy)

module.exports = router