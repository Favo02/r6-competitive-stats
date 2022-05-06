const matchesRouter = require("express").Router()
const Match = require("../models/match")
const Team = require("../models/team")
const middleware = require("../utils/middleware")

matchesRouter.get("/", middleware.tokenExtractor, middleware.userExtractor, async (request, response) => {
    const user = request.user
    const teams = user.teams

    const matches = await Match
        .find({ team: { "$in": teams } })

    response.json(matches)
})

matchesRouter.post("/", middleware.tokenExtractor, middleware.userExtractor, async (request, response) => {
    const match = request.body
    const team = await Team.findById(match.team)
    const date = match.info.date

    const existingMatch = await Match.findOne({ "info.date": date, "team": team })
    if (existingMatch) {
        console.log("existing date")
        return response.status(400).json({
            error: "Match already stored"
        })
    }

    const newMatch = new Match(match)
    const savedMatch = await newMatch.save()

    team.matches = team.matches.concat(savedMatch._id)
    await team.save()

    response.status(201).json(savedMatch)
})

matchesRouter.delete("/:id", middleware.tokenExtractor, middleware.userExtractor, async (request, response) => {
    const user = request.user
    const match = await Match.findById(request.params.id)
    const team = await Team.findById(match.team)

    if (!match) {
        return response.status(404).json({ error: "Match not found" })
    }
    else if (team.members
        .filter(m => m.permission === "admin")
        .map(m => m.id.toString())
        .includes(user.id)
    ) {
        await Match.findByIdAndRemove(request.params.id)

        team.matches = team.matches.filter(m => m._id.toString() !== request.params.id )
        await team.save()

        response.status(204).end()
    }
    else {
        return response.status(401).json({ error: "User not authorized to delete" })
    }
})

module.exports = matchesRouter