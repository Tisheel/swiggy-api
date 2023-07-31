const tax = (cartTotal) => {
    return Number((0.18 * cartTotal).toFixed(2))
}

module.exports = tax