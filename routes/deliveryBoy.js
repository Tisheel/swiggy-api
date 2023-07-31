const router = require('express').Router()

// Controller
const { getAllDeliveryBoy, deliveryBoyRating, deleteDeliveryBoy, updateDeliveryBoy, getDeliveryBoyById } = require('../controllers/deliveryBoyController')

// Routes
router.get('/:deliveryBoyId', getDeliveryBoyById)
router.get('/', getAllDeliveryBoy)
router.patch('/update/:deliveryBoyId', updateDeliveryBoy)
router.patch('/rating/:deliveryBoyId', deliveryBoyRating)
router.delete('/delete/:deliveryBoyId', deleteDeliveryBoy)

module.exports = router