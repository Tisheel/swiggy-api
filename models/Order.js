const mongoose = require('mongoose')
const { foodSchema } = require('./Food')

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    restaurantId: {
        type: mongoose.Types.ObjectId,
        ref: 'Restaurant',
        required: true
    },
    cart: [
        {
            food: foodSchema,
            quantity: {
                type: Number,
                default: 1
            }
        }
    ],
    location: {
        coordinates: {
            latitude: {
                type: String,
                required: [true, 'latitude is required']
            },
            longitude: {
                type: String,
                required: [true, 'longitude is required']
            }
        },
        address: {
            addressLine: {
                type: String
            },
            adminDistrict: {
                type: String
            },
            adminDistrict2: {
                type: String
            },
            countryRegion: {
                type: String
            },
            formattedAddress: {
                type: String
            },
            locality: {
                type: String
            },
            postalCode: {
                type: String
            }
        }
    },
    bill: {
        cartTotal: {
            type: String,
            required: true
        },
        tax: {
            type: String,
            required: true
        },
        deliveryCharge: {
            type: String,
            required: true
        },
        grandTotal: {
            type: String,
            required: true
        }
    },
    payment: {
        method: {
            type: String,
            required: true
        },
        razorpay: {
            type: Object
        }
    },
    order: {
        status: {
            type: String,
            default: 'Order Placed'
        },
        time: {
            type: String
        }
    },
    deliveryPerson: {
        type: mongoose.Types.ObjectId,
        ref: 'DeliveryBoy'
    }
}, { timestamps: true })

const Order = mongoose.model('Order', orderSchema)
module.exports = Order