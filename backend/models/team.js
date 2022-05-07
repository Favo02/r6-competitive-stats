const mongoose = require("mongoose")

const teamSchema = new mongoose.Schema({
    name: String,
    members: [{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        permission: { type: String, enum: ["admin", "member"] },
    }],
    waitingMembers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    matches: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Match"
    }]
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