const User = require("../models/User")
const DeliveryBoy = require('../models/DeliveryBoy')
const Verification = require("../models/Verification")
const sendMessage = require('../utils/sendMessage')

module.exports.sendOTP = async (req, res) => {
    try {
        const { holderType, holderId, credentialType, credential, expiresIn } = req.body
        const otp = Math.floor(100000 + Math.random() * 900000)

        const verify = new Verification({ holderType, holderId, credentialType, credential, expiresIn: new Date(Date.now() + expiresIn * 60 * 1000), otp })
        await verify.save()

        if (credentialType === 'phone') {
            const body = `Dear customer, use this One Time Password ${verify.otp} to verify your account. This OTP will be valid until ${verify.expiresIn}.`
            await sendMessage(credential, body)
            return res.status(200).json({
                message: 'Message sent successfully.',
                _id: verify._id
            })
        } else if (credentialType === 'email') {
            // email
        } else {
            return res.status(400).json({
                message: 'Invalid credential to verify.'
            })
        }

        res.status(500).json({
            message: 'Somthing went wrong.'
        })
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

module.exports.verifyOTP = async (req, res) => {
    try {
        const _id = req.params.id
        const { otp } = req.body

        const verify = await Verification.findOne({ _id })

        if (verify === null) {
            return res.status(400).json({
                message: 'Somthing went wrong.'
            })
        }

        if (new Date(Date.now()).getTime() <= new Date(verify.expiresIn).getTime()) {
            if (otp === verify.otp) {
                await Verification.findByIdAndDelete(_id)
                if (verify.holderType === 'user') {
                    if (verify.credentialType === 'phone') {
                        await User.findByIdAndUpdate(verify.holderId, {
                            $set: {
                                "verifiedCredentials.phone": true
                            }
                        })
                    } else if (verify.credentialType === 'email') {
                        // email
                    } else {
                        return res.status(500).json({
                            message: 'Invalid credential to verify.'
                        })
                    }
                } else if (verify.holderType === 'deliveryboy') {
                    if (verify.credentialType === 'phone') {
                        await DeliveryBoy.findByIdAndUpdate(verify.holderId, {
                            $set: {
                                "verifiedCredentials.phone": true
                            }
                        })
                    } else if (verify.credentialType === 'email') {
                        // email
                    } else {
                        return res.status(500).json({
                            message: 'Invalid credential to verify.'
                        })
                    }
                }
                return res.status(200).json({
                    message: 'Verified successfully.'
                })
            } else {
                res.status(400).json({
                    message: 'Please enter the correct otp'
                })
            }
        } else {
            await Verification.findByIdAndDelete(_id)
            res.status(400).json({
                message: 'OTP expired.'
            })
        }
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}