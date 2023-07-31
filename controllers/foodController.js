const { Food } = require('../models/Food')
const { default: mongoose } = require('mongoose')

module.exports.addFood = async (req, res) => {
    try {
        const _id = req.params.id

        if (!mongoose.isValidObjectId(_id)) {
            return res.status(400).json({
                message: `Invalid ObjectId.`
            })
        }

        const { title, desc, price, img, cusine, isVeg, preparationTime, serves, customize, category } = req.body

        const newFood = Food({ restaurantId: _id, title, desc, price, img, cusine, isVeg, preparationTime, serves, customize, category })

        const savedFood = await newFood.save()

        res.status(200).json(savedFood)
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

module.exports.getAllFood = async (req, res) => {
    try {
        const food = await Food.find({})

        if (food.length === 0) {
            return res.status(404).json({
                message: `No food found.`
            })
        }

        res.status(200).json(food)
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

module.exports.getFoodById = async (req, res) => {
    try {
        const _id = req.params.id

        if (!mongoose.isValidObjectId(_id)) {
            return res.status(400).json({
                message: `Invalid ObjectId.`
            })
        }

        const food = await Food.findOne({ _id })

        if (food === null) {
            return res.status(404).json({
                message: `No Food found with _id(${_id}).`
            })
        }

        res.status(200).json(food)
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

module.exports.updateFood = async (req, res) => {
    try {
        const restaurantId = req.params.id
        const _id = req.params.foodId

        if (!mongoose.isValidObjectId(_id) && !mongoose.isValidObjectId(_id)) {
            return res.status(400).json({
                message: `Invalid ObjectId.`
            })
        }

        const { title, desc, price, img, cuisine, isVeg, preparationTime, serves, customize, category, isAvailable } = req.body

        const updatedFood = await Food.findOneAndUpdate({ _id, restaurantId }, { title, desc, price, img, cuisine, isVeg, preparationTime, serves, customize, category, isAvailable }, { runValidators: true, new: true })

        if (updatedFood === null) {
            return res.status(404).json({
                message: `Food with _id(${_id}) not found under restaurant.`
            })
        }

        res.status(200).json(updatedFood)
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

module.exports.deleteFood = async (req, res) => {
    try {
        const restaurantId = req.params.id
        const _id = req.params.foodId

        if (!mongoose.isValidObjectId(_id) && !mongoose.isValidObjectId(restaurantId)) {
            return res.status(400).json({
                message: `Invalid ObjectId.`
            })
        }

        const deletedFood = await Food.findOneAndDelete({ _id, restaurantId })

        if (deletedFood === null) {
            return res.status(400).json({
                message: 'Cannot delete food.'
            })
        }

        res.status(200).json(deletedFood)
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}