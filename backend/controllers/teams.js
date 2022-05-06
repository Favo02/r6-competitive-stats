const teamsRouter = require("express").Router()
const Team = require("../models/team")
const User = require("../models/user")
const middleware = require("../utils/middleware")

// AUTH - get every team of the user
teamsRouter.get("/", middleware.tokenExtractor, middleware.userExtractor, async (request, response) => {
    const user = request.user

    const teams = await Team
        .find({ "members.id": user.id })

    response.json(teams)
})

// AUTH - create a new team
teamsRouter.post("/", middleware.tokenExtractor, middleware.userExtractor, async (request, response) => {
    const user = request.user
    const team = {
        name: request.body.name,
        members: [{ id: user.id, permission: "admin" }]
    }

    const existingTeam = await Team.findOne({ "name": team.name })
    if (existingTeam) {
        console.log("existing team")
        return response.status(400).json({
            error: "Team name already taken"
        })
    }

    const newTeam = new Team(team)
    const savedTeam = await newTeam.save()

    user.teams = user.teams.concat(savedTeam._id)
    await user.save()

    response.status(201).json(savedTeam)
})

// AUTH - add an user to waitingMember
teamsRouter.put("/:id", middleware.tokenExtractor, middleware.userExtractor, async (request, response) => {
    const id = request.params.id
    const userId = request.user.id

    const user = await User.findOne({ _id: userId })

    const team = await Team.findOne({ _id: id })

    team.waitingMembers = team.waitingMembers.concat(user.id)
    const updatedTeam = await team.save()
    response.json(updatedTeam)
})

// UNAUTH - get every team matching the name
teamsRouter.get("/:name", async (request, response) => {
    const name = request.params.name

    const teams = await Team
        .find({ "name": { $regex: name + "*" } })
    response.json(teams)
})

module.exports = teamsRouter