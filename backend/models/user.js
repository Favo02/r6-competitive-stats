const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username:       { type: String, required: true, match: [/^[a-zA-Z0-9](_(?!(\.|_))|\.(?!(_|\.))|[a-zA-Z0-9]){2,14}[a-zA-Z0-9]$/, "Please fill a valid username: 4-16 characters long, alpanumeric with underscore and dot (_ .), no consecutive special characters, no special characters at start or end"] },
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