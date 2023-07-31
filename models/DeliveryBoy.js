const mongoose = require('mongoose')
const validator = require('validator')

const validatePhone = (phone) => {
    return validator.isMobilePhone(phone, ['en-IN'])
}

const deliveryBoySchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Please provide first name.']
    },
    lastName: {
        type: String,
        required: [true, 'Please provide last name.']
    },
    photo: {
        type: String,
        required: [true, 'Photo of the delivery person required.']
    },
    gender: {
        type: String,
        required: [true, 'Please give delivery person gender.']
    },
    email: {
        type: String,
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
        required: [true, 'Please provide password.']
    },
    vehicle: {
        vehicleType: {
            type: Number,
            required: [true, 'Please give the type of vehilce.']
        },
        vehicleCompany: {
            type: String,
            required: [true, 'Please give the company of vehilce.']
        },
        vehicleModel: {
            type: String,
            required: [true, 'Please give the model of vehilce.']
        },
        vehilceNumber: {
            type: String,
            required: [true, 'Please give the registered number of vehilce.']
        }
    },
    ratings: [
        {
            type: Number,
            min: 1,
            max: 5
        }
    ],
    isActive: {
        type: Boolean,
        default: false
    },
    isAvailable: {
        type: Boolean,
        default: false
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
    },
    currentLocation: {
        coordinates: {
            latitude: {
                type: String
            },
            longitude: {
                type: String
            }
        },
        address: {
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
    identityProof: {
        adhaar: {
            number: {
                type: String,
                required: [true, 'Adhaar number required.']
            },
            img: {
                type: String,
                required: [true, 'Adhaar photo required.']
            }
        },
        drivingLicence: {
            number: {
                type: String,
                required: [true, 'Adhaar number required.']
            },
            img: {
                type: String,
                required: [true, 'Adhaar photo required.']
            }
        }
    },
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
})

deliveryBoySchema.set('toJSON', {
    transform: function (doc, ret, opt) {
        delete ret['password']
        delete ret['__v']
        delete ret['createdAt']
        delete ret['updatedAt']
        return ret
    }
})

const DeliveryBoy = mongoose.model('DeliveryBoy', deliveryBoySchema)
module.exports = DeliveryBoy