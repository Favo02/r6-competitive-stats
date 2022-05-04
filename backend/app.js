const express = require("express")
require("express-async-errors")
const app = express()
const cors = require("cors")
const config = require("./utils/config")
const mongoose = require("mongoose")
const compression = require("compression")
const helmet = require("helmet")

const usersRouter = require("./controllers/users")
const loginRouter = require("./controllers/login")
const matchesRouter = require("./controllers/matches")

const middleware = require("./utils/middleware")
const logger = require("./utils/logger")

logger.info("connecting to", config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info("connected to MongoDB")
    })
    .catch((error) => {
        logger.error("error connecting to MongoDB:", error.message)
    })

app.use(compression())
app.use(helmet())
app.use(cors())
app.use(express.static("build"))
app.use(express.json())
app.use(middleware.requestLogger)

if (process.env.NODE_ENV === "dev") {
    app.use("/api/users", usersRouter)
}
app.use("/api/login", loginRouter)
app.use("/api/matches", matchesRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app