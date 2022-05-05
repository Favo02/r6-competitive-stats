require("dotenv").config()

const PORT = process.env.PORT

const MONGODB_URI = process.env.MONGODB_URI

const MONGODB_DEV_URI = process.env.MONGODB_DEV_URI

module.exports = {
    MONGODB_URI,
    MONGODB_DEV_URI,
    PORT
}