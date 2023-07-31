const mongoose = require('mongoose')
const validator = require('validator')

const validatePhone = (phone) => {
    return validator.isMobilePhone(phone, ['en-IN'])
}

const restaurantSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a name.']
    },
    img: {
        type: String,
        required: [true, 'Please provide a image of restaurantw.']
    },
    banner: {
        type: String
    },
    email: {
        type: String,
        required: [true, 'Please provide an email.'],
        validate: [validator.isEmail, 'Please provide a valid email.'],
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: [true, 'Please provide a phone number.'],
        validate: [validatePhone, 'Please provide a valid phone number.']
    },
    password: {
        type: String,
        required: [true, 'Please provide a password.'],
        minLength: [6, 'Please provide a password with mininum six characters.'],
        trim: true
    },
    cuisines: {
        type: [String],
        required: [true, `Please provide cuisines offered by your restaurant.`]
    },
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
    reviews: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            review: {
                type: String,
                minLength: 5,
                maxLength: 256
            },
            ratings: {
                type: Number,
                min: 1,
                max: 5
            }
        }
    ],
    costForTwo: {
        type: String,
        required: [true, `Please provide cost for two people in your restaurant.`]
    },
    isAvailable: {
        type: Boolean,
        default: false
    },
    isPromoted: {
        type: Boolean,
        default: false
    },
    menu: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Menu'
    }
}, { timestamps: true })

restaurantSchema.set('toJSON', {
    transform: function (doc, ret, opt) {
        delete ret['password']
        delete ret['__v']
        delete ret['createdAt']
        delete ret['updatedAt']
        return ret
    }
})

const Restaurant = mongoose.model('Restaurant', restaurantSchema)
module.exports = Restaurant