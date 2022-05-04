const matchesRouter = require("express").Router()
const Match = require("../models/match")
const middleware = require("../utils/middleware")

matchesRouter.get("/", middleware.tokenExtractor, middleware.userExtractor, async (request, response) => {
    const user = request.user

    const matches = await Match
        .find({ user: user.id })

    response.json(matches)
})

matchesRouter.post("/", middleware.tokenExtractor, middleware.userExtractor, async (request, response) => {
    const match = request.body
    const user = request.user
    match.user = user.id
    const date = match.info.date

    const existingMatch = await Match.findOne({ "info.date": date, "user": user.id })
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

matchesRouter.delete("/:id", middleware.tokenExtractor, middleware.userExtractor, async (request, response) => {
    const user = request.user
    const match = await Match.findById(request.params.id)

    if (!match) {
        return response.status(404).json({ error: "Match not found" })
    }
    else if (user.id === match.user.toString()) {
        await Match.findByIdAndRemove(request.params.id)

        user.matches = user.matches.filter(match => match._id.toString() !== request.params.id )
        await user.save()

        response.status(204).end()
    }
    else {
        return response.status(401).json({ error: "User not authorized to delete" })
    }
})

module.exports = matchesRouter