const mongoose = require('mongoose')

const foodSchema = new mongoose.Schema({
    restaurantId: {
        type: mongoose.Types.ObjectId,
        ref: 'Restaurant'
    },
    title: {
        type: String,
        required: [true, 'Please give title of the food.']
    },
    cusine: {
        type: String,
        required: [true, 'Please give cusine of the food.']
    },
    img: {
        type: String,
        required: [true, 'Please upload image of the food.']
    },
    desc: {
        type: String,
        required: [true, 'Please give description of the food.']
    },
    isVeg: {
        type: Boolean,
        required: [true, 'Please specify veg or non veg.']
    },
    serves: {
        type: Number,
        required: [true, 'Specify number of people food will serve.']
    },
    price: {
        type: String,
        required: [true, 'Please provide price of the food.']
    },
    preparationTime: {
        type: Number,
        required: [true, 'Please give time taken to make food in minutes.']
    },
    category: {
        type: String,
        required: [true, 'Please give category of this food.']
    },
    isAvailable: {
        type: Boolean,
        default: false
    },
    customize: [
        {
            title: {
                type: String
            },
            isVeg: {
                type: Boolean
            },
            price: {
                type: String
            },
            isAvailable: {
                type: Boolean,
                default: false
            }
        }
    ]
}, { timestamps: true })


const Food = mongoose.model('Food', foodSchema)
module.exports = { Food, foodSchema }