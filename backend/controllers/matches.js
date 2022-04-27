const matchesRouter = require("express").Router()
const Match = require("../models/match")
const middleware = require("../utils/middleware")

matchesRouter.get("/", async (request, response) => {
    const matches = await Match
        .find({})

    response.json(matches)
})

matchesRouter.post("/", middleware.tokenExtractor, middleware.userExtractor, async (request, response) => {
    const match = request.body
    const user = request.user
    match.user = user.id
    const date = match.info.date

    const existingMatch = await Match.findOne({ "info.date": date })
    if (existingMatch) {
        console.log("existing date")
        return response.status(400).json({
            error: "Match already stored"
        })
    }

    const newMatch = new Match(match)
    const savedMatch = await newMatch.save()

    user.matches = user.matches.concat(savedMatch._id)
    await user.save()

    response.status(201).json(savedMatch)
})

module.exports = matchesRouter