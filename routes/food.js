const router = require('express').Router()

// Controllers
const { deleteFood, addFood, getAllFood, getFoodById, updateFood } = require('../controllers/foodController')

// Routes
router.post('/add/:id', addFood)
router.get('/', getAllFood)
router.get('/:id', getFoodById)
router.patch('/update/:id/:foodId', updateFood)
router.delete('/delete/:id/:foodId', deleteFood)

module.exports = router