const mongoose = require('mongoose')
const validator = require('validator')

const validatePhone = (phone) => {
    return validator.isMobilePhone(phone, ['en-IN'])
}

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required.']
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required.']
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
        type: String
    },
    locations: [
        {
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
        }
    ],
    favorites: [{
        type: mongoose.Types.ObjectId,
        ref: 'food'
    }],
    verifiedCredentials: {
        phone: {
            type: Boolean,
            default: false
        },
        email: {
            type: Boolean,
            default: false
        }
    }
}, { timestamps: true })

userSchema.set('toJSON', {
    transform: function (doc, ret, opt) {
        delete ret['password']
        delete ret['__v']
        delete ret['createdAt']
        delete ret['updatedAt']
        return ret
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User