const mongoose = require("mongoose")

const matchSchema = new mongoose.Schema({
    team: {
        $type: mongoose.Schema.Types.ObjectId,
        ref: "Team"
    },
    info: {
        category: String,
        gamemode: String,
        map: String,
        my_team: String,
        match_uuid: String,
        rosters: {
            my_team: [
                {
                    username: String,
                    roster: String
                }
            ],
            enemy_team: [
                {
                    username: String,
                    roster: String
                }
            ]
        },
        date: String
    },
    performance: [
        {
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
        }
    ],
    result: {
        my_team: {
            atks: Number,
            defs: Number,
            overtime_as: String,
            score: Number,
            score_at_half: Number,
            start_as: String
        },
        enemy_team: {
            atks: Number,
            defs: Number,
            overtime_as: String,
            score: Number,
            score_at_half: Number,
            start_as: String
        }
    },
    roundPerformance: [
        [
            {
                clutch: Number,
                clutch_attempt: Number,
                disabled: Number,
                headshots: Number,
                kill_streak: Number,
                name: String,
                opening_death: Number,
                opening_kill: Number,
                opening_pick: Number,
                opening_picked: Number,
                operator: String,
                planted: Number,
                refrags: Number,
                team: String,
                teamkills: Number,
                traded_death: Number,
                traded_kill: Number,
                untraded_death: Number,
                untraded_kill: Number
            }
        ]
    ],
    rounds: [{
        events: [{
            killer: String,
            killer_roster: String,
            opening: Boolean,
            team: String,
            timestamp: Number,
            type: String,
            victim: String,
            victim_roster: String,
        }],
        info: {
            enemy_team_kills: Number,
            enemy_team_side: String,
            my_team_kills: Number,
            my_team_side: String,
            site: String,
            spawn: String,
            winner: String
        }
    }],
},
// rename mongoose default type: to $type:
{
    typeKey: "$type"
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