const router = require('express').Router()

// Controllers
const { updateUser, removeFavorite, addFavorite, removeLocation, addLocation, getAllUser, getUserById, deleteUser } = require('../controllers/userController')

// Routes
router.get('/', getAllUser)
router.get('/:id', getUserById)
router.post('/add/location/:id', addLocation)
router.post('/remove/location/:id/:locationId', removeLocation)
router.post('/add/favorite/:id/:favoriteId', addFavorite)
router.post('/remove/favorite/:id/:favoriteId', removeFavorite)
router.patch('/update/:id', updateUser)
router.delete('/delete/:id', deleteUser)

module.exports = router