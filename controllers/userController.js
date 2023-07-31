const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { default: mongoose } = require('mongoose')
const randomstring = require("randomstring")
const sendMessage = require('../utils/sendMessage')

module.exports.registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, password } = req.body

        const user = await User.findOne({ phone })

        if (user !== null) {
            return res.status(403).json({
                message: `User already exsists with ${phone} please login.`
            })
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: 'Password must have minimum six characters.'
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = new User({ firstName, lastName, email, phone, password: hashedPassword })
        const savedUser = await newUser.save()

        // const { JWT_SECRET, JWT_EXPIRY } = process.env
        // const payload = { _id: savedUser._id }
        // const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY })

        res.status(201).json(savedUser)
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

module.exports.loginUser = async (req, res) => {
    try {
        const { phone, password } = req.body

        if (!(phone && password)) {
            return res.status(400).json({
                message: 'Phone and password are required.'
            })
        }

        const user = await User.findOne({ phone })

        if (user === null) {
            return res.status(404).json({
                message: `User with ${phone} does not exsist please register.`
            })
        } else {
            if (await bcrypt.compare(password, user.password)) {
                const { JWT_SECRET, JWT_EXPIRY } = process.env
                const payload = { _id: user._id }
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

module.exports.getAllUser = async (req, res) => {
    try {
        const users = await User.find({})

        if (users.length === 0) {
            return res.status(404).json({
                message: `No user found.`
            })
        }

        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

module.exports.getUserById = async (req, res) => {
    try {
        const _id = req.params.id

        if (!mongoose.isValidObjectId(_id)) {
            return res.status(400).json({
                message: `Invalid ObjectId.`
            })
        }

        const user = await User.findOne({ _id })

        if (user === null) {
            return res.status(404).json({
                message: `No user found with _id(${_id}).`
            })
        }

        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

module.exports.addLocation = async (req, res) => {
    try {
        const _id = req.params.id

        if (!mongoose.isValidObjectId(_id)) {
            return res.status(400).json({
                message: `Invalid ObjectId.`
            })
        }

        const { coordinates, address } = req.body

        const response = await User.findByIdAndUpdate({ _id }, {
            $push: {
                locations: {
                    coordinates,
                    address
                }
            }
        }, { new: true, runValidators: true })

        if (response === null) {
            return res.status(401).json({
                message: `No user found with _id(${_id}).`
            })
        }

        res.status(200).json(response)
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

module.exports.removeLocation = async (req, res) => {
    try {
        const _id = req.params.id
        const locationId = req.params.locationId

        if (!(mongoose.isValidObjectId(_id) && mongoose.isValidObjectId(locationId))) {
            return res.status(400).json({
                message: `Invalid ObjectId.`
            })
        }

        const response = await User.findByIdAndUpdate({ _id }, {
            $pull: {
                locations: {
                    _id: locationId
                }
            }
        }, { new: true })

        if (response === null) {
            return res.status(401).json({
                message: `No user found with _id(${_id}).`
            })
        }

        res.status(200).json(response)
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

module.exports.addFavorite = async (req, res) => {
    try {
        const _id = req.params.id
        const favoriteId = req.params.favoriteId

        if (!(mongoose.isValidObjectId(_id) && mongoose.isValidObjectId(favoriteId))) {
            return res.status(400).json({
                message: `Invalid ObjectId.`
            })
        }

        const response = await User.findByIdAndUpdate({ _id }, {
            $push: {
                favorites: favoriteId
            }
        }, { new: true, runValidators: true })

        if (response === null) {
            return res.status(401).json({
                message: `No user found with _id(${_id}).`
            })
        }

        res.status(200).json(response)
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

module.exports.removeFavorite = async (req, res) => {
    try {
        const _id = req.params.id
        const favoriteId = req.params.favoriteId

        if (!(mongoose.isValidObjectId(_id) && mongoose.isValidObjectId(favoriteId))) {
            return res.status(400).json({
                message: `Invalid ObjectId.`
            })
        }

        const response = await User.findByIdAndUpdate({ _id }, {
            $pull: {
                favorites: favoriteId
            }
        }, { new: true })

        if (response === null) {
            return res.status(401).json({
                message: `No user found with _id(${_id}).`
            })
        }

        res.status(200).json(response)
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

module.exports.deleteUser = async (req, res) => {
    try {
        const _id = req.params.id

        if (!mongoose.isValidObjectId(_id)) {
            return res.status(400).json({
                message: `Invalid ObjectId.`
            })
        }

        const deleteUser = await User.findByIdAndDelete(_id)

        if (deleteUser === null) {
            return res.status(400).json({
                message: `Cannot delete user.`
            })
        }

        res.status(200).json(deleteUser)
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

module.exports.updateUser = async (req, res) => {
    try {
        const _id = req.params.id

        if (!mongoose.isValidObjectId(_id)) {
            return res.status(400).json({
                message: `Invalid ObjectId.`
            })
        }

        const { firstName, lastName, email } = req.body

        const updatedUser = await User.findByIdAndUpdate(_id, { firstName, lastName, email }, { new: true })

        if (updatedUser === null) {
            return res.status(400).json({
                message: `Cannot update user.`
            })
        }

        res.status(200).json(updatedUser)
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