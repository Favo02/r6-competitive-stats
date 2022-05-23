const mongoose = require("mongoose")

const teamSchema = new mongoose.Schema({
    name:           { type: String, required: true, match: [/^[a-zA-Z0-9]((?!(-))|-(?!(-))|[a-zA-Z0-9]){2,18}[a-zA-Z0-9]$/, "Please fill a valid name: 4-20 characters long, alpanumeric and dash (-), no consecutive dashes, no dashes at start or end"] },
    members:    [{
        id:         { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
        permission: { type: String, required: true, enum: ["admin", "member"] },
    }],
    waitingMembers: [{ type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" }],
    matches:        [{ type: mongoose.Schema.Types.ObjectId, required: true, ref: "Match" }],
    categories:     [{ type: String, required: true }],
})

teamSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Team = mongoose.model("Team", teamSchema)

module.exports = Team