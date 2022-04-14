const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: [3, "should be at least 3 characters long"]
    },
    passwordHash: String,
    permission: { type: String, enum: ["admin", "member", "guest"] }
})

userSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash
    }
})

const User = mongoose.model("User", userSchema)

module.exports = User