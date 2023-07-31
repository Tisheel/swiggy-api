const mongoose = require('mongoose')

const verificationSchema = new mongoose.Schema({
    holderType: {
        type: String,
        required: true
    },
    holderId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    credentialType: {
        type: String,
        lowercase: true,
        trim: true,
        required: true
    },
    credential: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    expiresIn: {
        type: String,
        required: true
    }
})

const Verification = mongoose.model('Verification', verificationSchema)
module.exports = Verification