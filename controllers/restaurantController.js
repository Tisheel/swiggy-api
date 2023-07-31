const Restaurant = require('../models/Restaurant')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { default: mongoose } = require('mongoose')

module.exports.restaurantRegister = async (req, res) => {
    try {
        const { title, img, banner, email, phone, password, cuisines, location, costForTwo } = req.body

        const restaurant = await Restaurant.findOne({ phone })

        if (restaurant !== null) {
            return res.status(403).json({
                message: `Restaurant already exsists with +91${phone} please login`
            })
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: 'Password must have minimum six characters.'
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newRestaurant = new Restaurant({ title, img, banner, email, phone, password: hashedPassword, cuisines, location, costForTwo })

        const savedRestaurant = await newRestaurant.save()

        res.status(201).json(savedRestaurant)
    } catch (error) {
        if (error.name === "ValidationError") {
            const message = Object.values(error.errors).map(value => value.message);
            return res.status(400).json({
                message
            })
        }
        res.status(500).json({
            error: error.message
        })
    }
}

module.exports.restaurantLogin = async (req, res) => {
    try {
        const { phone, password } = req.body

        if (!(phone && password)) {
            return res.status(400).json({
                message: 'Phone and password are required.'
            })
        }

        const restaurant = await Restaurant.findOne({ phone })

        if (restaurant === null) {
            return res.status(404).json({
                message: `Restaurant with ${phone} does not exsist please register.`
            })
        } else {
            if (await bcrypt.compare(password, restaurant.password)) {
                const { JWT_SECRET, JWT_EXPIRY } = process.env
                const payload = { _id: restaurant._id }
                const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY })

                res.status(200).json(token)
            } else {
                return res.status(403).json({
                    message: 'Wrong password.'
                })
            }
        }
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

module.exports.getAllRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find({})

        if (restaurants.length === 0) {
            return res.status(404).json({
                message: `No restaurants found.`
            })
        }

        res.status(200).json(restaurants)
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

module.exports.getRestaurantById = async (req, res) => {
    try {
        const _id = req.params.id

        if (!mongoose.isValidObjectId(_id)) {
            return res.status(400).json({
                message: `Invalid ObjectId.`
            })
        }

        const restaurant = await Restaurant.findOne({ _id }).populate('menu')

        if (restaurant === null) {
            return res.status(404).json({
                message: `No restaurant found with _id(${_id}).`
            })
        }

        res.status(200).json(restaurant)
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

module.exports.updateRestaurant = async (req, res) => {
    try {
        const _id = req.params.id

        if (!mongoose.isValidObjectId(_id)) {
            return res.status(400).json({
                message: `Invalid ObjectId.`
            })
        }

        const { title, banner, img, email, cuisines, location, costForTwo, isAvailable } = req.body

        const updatedRestaurant = await Restaurant.findByIdAndUpdate(_id, { title, banner, img, email, cuisines, location, costForTwo, isAvailable }, { new: true, runValidators: true })

        if (updatedRestaurant === null) {
            return res.status(404).json({
                message: `No restaurant found with _id(${_id}).`
            })
        }

        res.status(200).json(updatedRestaurant)
    } catch (error) {
        if (error.name === "ValidationError") {
            const message = Object.values(error.errors).map(value => value.message);
            return res.status(400).json({
                message
            })
        }
        res.status(500).json({
            error: error.message
        })
    }
}

module.exports.addReview = async (req, res) => {
    try {
        const _id = req.params.id
        const userId = req.params.userId

        const { review, ratings } = req.body

        if (!mongoose.isValidObjectId(_id) && !mongoose.isValidObjectId(userId)) {
            return res.status(400).json({
                message: `Invalid ObjectId.`
            })
        }

        const restaurant = await Restaurant.findByIdAndUpdate(_id, {
            $push: {
                reviews: {
                    userId, review, ratings
                }
            }
        }, { runValidators: true, new: true })

        if (restaurant === null) {
            return res.status(404).json({
                message: `No restaurant found with _id(${_id}).`
            })
        }

        res.status(200).json(restaurant)
    } catch (error) {
        if (error.name === "ValidationError") {
            const message = Object.values(error.errors).map(value => value.message);
            return res.status(400).json({
                message
            })
        }
        res.status(500).json({
            error: error.message
        })
    }
}

module.exports.removeReview = async (req, res) => {
    try {
        const _id = req.params.id
        const userId = req.params.userId
        const reviewId = req.params.reviewId

        if (!mongoose.isValidObjectId(_id) && !mongoose.isValidObjectId(userId) && !mongoose.isValidObjectId(reviewId)) {
            return res.status(400).json({
                message: `Invalid ObjectId.`
            })
        }

        const restaurant = await Restaurant.findByIdAndUpdate(_id, {
            $pull: {
                reviews: {
                    userId,
                    _id: reviewId
                }
            }
        }, { runValidators: true, new: true })

        if (restaurant === null) {
            return res.status(404).json({
                message: `No restaurant found with _id(${_id}).`
            })
        }

        res.status(200).json(restaurant)
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

module.exports.removeRestaurant = async (req, res) => {
    try {
        const _id = req.params.id

        if (!mongoose.isValidObjectId(_id)) {
            return res.status(400).json({
                message: `Invalid ObjectId.`
            })
        }

        const deletedRestaurant = await Restaurant.findByIdAndDelete(_id)

        if (deletedRestaurant === null) {
            return res.status(400).json({
                message: `Cannot delete restaurant.`
            })
        }

        res.status(200).json(deletedRestaurant)
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}