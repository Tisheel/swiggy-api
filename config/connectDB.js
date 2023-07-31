const mongoose = require("mongoose");

module.exports = connectToMongoDB = async () => {
    mongoose
        .connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => console.log(`MongoDB Connected Successfully`))
        .catch((error) => {
            console.log(`MongoDB Connection Unsuccessfull\n`, error)
        })
}
