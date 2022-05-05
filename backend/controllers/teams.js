const teamsRouter = require("express").Router()
const Team = require("../models/team")
const middleware = require("../utils/middleware")

teamsRouter.post("/", middleware.tokenExtractor, middleware.userExtractor, async (request, response) => {
    const team = request.body
    const user = request.user
    team.users = [{ id: user.id, permission: "admin" }]

    const existingTeam = await Team.findOne({ "name": team.name })
    if (existingTeam) {
        console.log("existing team")
        return response.status(400).json({
            error: "Team anem already taken"
        })
    }

    const newTeam = new Team(team)
    const savedTeam = await newTeam.save()

    user.teams = user.teams.concat(savedTeam._id)
    await user.save()

    response.status(201).json(savedTeam)
})

module.exports = teamsRouter