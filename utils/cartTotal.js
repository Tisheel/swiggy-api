
const cartTotal = (cart) => {
    let total = 0
    for (let item of cart) {
        let subTotal = 0
        subTotal = subTotal + Number(item.food.price)
        if (item.food.customize.length !== 0) {
            for (let custom of item.food.customize) {
                subTotal = subTotal + Number(custom.price)
            }
        }
        subTotal = subTotal * item.quantity
        total = total + subTotal
    }
    return total
}

module.exports = cartTotal