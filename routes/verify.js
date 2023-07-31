const router = require('express').Router()

// Controller
const { sendOTP, verifyOTP } = require('../controllers/verifyController')

// Routes
router.post('/sendOTP', sendOTP)
router.post('/verifyOTP/:id', verifyOTP)

module.exports = router