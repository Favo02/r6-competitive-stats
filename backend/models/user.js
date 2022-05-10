const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username:       { type: String, required: true, minlength: [3, "should be at least 3 characters long"] },
    email:          { type: String, required: true, match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please fill a valid email address"] },
    passwordHash:   { type: String, required: true },
    teams:          [ { type: mongoose.Schema.Types.ObjectId, ref: "Team" } ]
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