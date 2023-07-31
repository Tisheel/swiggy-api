const DeliveryBoy = require('../models/DeliveryBoy')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { default: mongoose } = require('mongoose')

module.exports.registerDeliveryBoy = async (req, res) => {
    try {
        const { firstName, lastName, photo, gender, email, phone, password, vehicle, address, identityProof } = req.body

        const deliveryBoy = await DeliveryBoy.findOne({ phone })

        if (deliveryBoy !== null) {
            return res.status(403).json({
                message: `Delivery boy with (${phone}) present please login.`
            })
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: `Password length must be atleast six.`
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newDeliveryBoy = new DeliveryBoy({ firstName, lastName, photo, gender, photo, email, phone, password: hashedPassword, vehicle, identityProof, address })

        const savedDeliveryBoy = await newDeliveryBoy.save()

        res.status(200).json(savedDeliveryBoy)
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

module.exports.loginDeliveryBoy = async (req, res) => {
    try {
        const { phone, password } = req.body

        if (!(phone && password)) {
            return res.status(400).json({
                message: 'Phone and password are required.'
            })
        }

        const deliveryBoy = await DeliveryBoy.findOne({ phone })

        if (deliveryBoy === null) {
            return res.status(404).json({
                message: `Delivery boy with +91${phone} does not exsist please register.`
            })
        } else {
            if (await bcrypt.compare(password, deliveryBoy.password)) {
                const { JWT_SECRET, JWT_EXPIRY } = process.env
                const payload = { _id: deliveryBoy._id }
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

module.exports.getAllDeliveryBoy = async (req, res) => {
    try {
        const deliveryBoys = await DeliveryBoy.find({})

        if (deliveryBoys.length === 0) {
            return res.status(404).json({
                message: `No delivery boy found.`
            })
        }

        res.status(200).json(deliveryBoys)
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

module.exports.getDeliveryBoyById = async (req, res) => {
    try {
        const deliveryBoyId = req.params.deliveryBoyId

        if (!mongoose.isValidObjectId(deliveryBoyId)) {
            return res.status(400).json({
                message: `Invalid ObjectId.`
            })
        }

        const deliveryBoy = await DeliveryBoy.findOne({ _id: deliveryBoyId })

        if (deliveryBoy === null) {
            return res.status(404).json({
                message: `No delivery boy found.`
            })
        }

        res.status(200).json(deliveryBoy)
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

module.exports.updateDeliveryBoy = async (req, res) => {
    try {
        const deliveryBoyId = req.params.deliveryBoyId

        if (!mongoose.isValidObjectId(deliveryBoyId)) {
            return res.status(400).json({
                message: `Invalid ObjectId.`
            })
        }

        const { vehicle, currentLocation, isAvailable, isActive, address } = req.body

        const updatedDeliveryBoy = await DeliveryBoy.findByIdAndUpdate(deliveryBoyId, { vehicle, currentLocation, isAvailable, isActive, address }, { new: true })

        if (updatedDeliveryBoy === null) {
            return res.status(404).json({
                message: `No delivery person found with _id(${deliveryBoyId}).`
            })
        }

        res.status(200).json(updatedDeliveryBoy)
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

module.exports.deleteDeliveryBoy = async (req, res) => {
    try {
        const deliveryBoyId = req.params.deliveryBoyId

        if (!mongoose.isValidObjectId(deliveryBoyId)) {
            return res.status(400).json({
                message: `Invalid ObjectId.`
            })
        }

        const deletedDeliveryBoy = await DeliveryBoy.findByIdAndDelete(deliveryBoyId)

        if (deletedDeliveryBoy === null) {
            return res.status(400).json({
                message: 'Cannot delete delivery boy.'
            })
        }

        res.status(200).json(deletedDeliveryBoy)
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

module.exports.deliveryBoyRating = async (req, res) => {
    try {
        const deliveryBoyId = req.params.deliveryBoyId
        const { ratings } = req.body

        if (!mongoose.isValidObjectId(deliveryBoyId)) {
            return res.status(400).json({
                message: `Invalid ObjectId.`
            })
        }

        const deliveryBoy = await DeliveryBoy.findByIdAndUpdate({ _id: deliveryBoyId }, {
            $push: {
                ratings
            }
        }, { runValidators: true, new: true })

        if (deliveryBoy === null) {
            return res.status(404).json({
                message: `Delivery boy with _id(${deliveryBoyId} not found.`
            })
        }

        res.status(200).json(deliveryBoy)
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