const router = require('express').Router()

// Controllers
const { removeRestaurant, removeReview, addReview, updateRestaurant, getAllRestaurants, getRestaurantById } = require('../controllers/restaurantController')

// Routes
router.get('/', getAllRestaurants)
router.get('/:id', getRestaurantById)
router.patch('/update/:id', updateRestaurant)
router.patch('/add/review/:id/:userId', addReview)
router.patch('/remove/review/:id/:reviewId/:userId', removeReview)
router.delete('/remove/:id', removeRestaurant)

module.exports = router