const mongoose = require("mongoose")

const matchSchema = new mongoose.Schema({
    info: {
        gamemode: String,
        map: String,
        my_team: String,
        match_uuid: String,
        rosters: {
            my_team: [{
                username: String,
                roster: String
            }],
            enemy_team: [{
                username: String,
                roster: String
            }]
        },
        date: String
    },
    performance: [{
        team: String,
        username: String,
        kills: Number,
        deaths: Number,
        rating: String,
        matchkost: String,
        ukills: Number,
        tkills: Number,
        udeaths: Number,
        tdeaths: Number,
        refrags: Number,
        tradediff: Number,
        opicks: Number,
        opicked: Number,
        okills: Number,
        odeaths: Number,
        kpr: String,
        srv: String,
        headshots: Number,
        clutches: Number,
        clutch_attempts: Number,
        pdefuser: Number,
        ddefuser: Number,
        multikill: Number,
        teamkills: Number
    }]
})

matchSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Match = mongoose.model("Match", matchSchema)

module.exports = Match