const Order = require('../models/Order')
const Restaurant = require('../models/Restaurant')
const DeliveryBoy = require('../models/DeliveryBoy')
const { default: mongoose } = require('mongoose')
const cartTotal = require('../utils/cartTotal')
const tax = require('../utils/tax')
const sendMessage = require('../utils/sendMessage')

module.exports.createOrder = async (req, res) => {
    try {
        const userId = req.params.userId

        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).json({
                message: `Invalid ObjectId.`
            })
        }

        const { cart, location, payment, restaurantId } = req.body

        if (cart.length === 0) {
            return res.status(400).json({
                message: `Cart is empty.`
            })
        }

        const filteredCart = cart.filter((item) => item.food.restaurantId !== restaurantId)

        if (filteredCart.length !== 0) {
            return res.status(400).json({
                message: 'Cart cannot contain food from different restaurants.'
            })
        }

        const restaurant = await Restaurant.findById(restaurantId)

        const deliveryPerson = await DeliveryBoy.findOne({ isAvailable: true, "currentLocation.address.postalCode": restaurant.location.address.postalCode })

        if (deliveryPerson === null) {
            return res.status(400).json({
                message: 'Sorry for the trouble order cannot be placed as no delivery boys available try after some time.'
            })
        }

        const bill = {}
        bill.cartTotal = cartTotal(cart)
        bill.tax = tax(bill.cartTotal)
        // calculate delivery charge
        bill.deliveryCharge = 100
        bill.grandTotal = bill.cartTotal + bill.deliveryCharge + bill.tax

        const newOrder = new Order(
            {
                userId,
                restaurantId,
                cart,
                location,
                bill,
                payment,
                deliveryPerson
            }
        )

        await newOrder.save()

        res.status(200).json(newOrder)
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

module.exports.cancelOrder = async (req, res) => {
    try {
        const _id = req.params.id

        if (!mongoose.isValidObjectId(_id)) {
            return res.status(400).json({
                message: `Invalid ObjectId.`
            })
        }

        const deletedOrder = await Order.findByIdAndDelete(_id)

        if (deletedOrder === null) {
            return res.status(400).json({
                message: 'Cannot delete order.'
            })
        }
        await deletedOrder.populate('userId')
        const body = `Your Order _id(${_id}) has been canceled. We are sorry 😔`
        sendMessage(deletedOrder.userId.phone, body)

        res.status(200).json({
            message: 'Order deleted successfully.'
        })
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

module.exports.updateOrder = async (req, res) => {
    try {
        const _id = req.params.id
        const { orderStatus } = req.body

        if (!mongoose.isValidObjectId(_id)) {
            return res.status(400).json({
                message: `Invalid ObjectId.`
            })
        }

        const updatedOrder = await Order.findByIdAndUpdate(_id,
            {
                $set: {
                    order: {
                        orderStatus,
                        time: new Date.now()
                    }
                }
            }, { runValidators: true, new: true })

        if (updatedOrder === null) {
            return res.status(400).json({
                message: 'Cannot update order.'
            })
        }

        res.status(200).json(updatedOrder)
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