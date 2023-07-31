const router = require('express').Router()

// Controllers
const { restaurantRegister, restaurantLogin } = require('../controllers/restaurantController')

// Routes
router.post('/register', restaurantRegister)
router.post('/login', restaurantLogin)


module.exports = router