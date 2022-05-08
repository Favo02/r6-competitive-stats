const teamsRouter = require("express").Router()
const Team = require("../models/team")
const User = require("../models/user")
const middleware = require("../utils/middleware")

// AUTH - get every team of the user
teamsRouter.get("/", middleware.tokenExtractor, middleware.userExtractor, async (request, response) => {
    const user = request.user

    const teams = await Team
        .find({ "members.id": user.id })
        .populate([
            { path: "members.id", select: { id: 1, username: 1 } },
            { path: "waitingMembers", select: { id: 1, username: 1 } }
        ])

    response.json(teams)
})

// AUTH - create a new team
teamsRouter.post("/", middleware.tokenExtractor, middleware.userExtractor, async (request, response) => {
    const user = request.user
    const team = {
        // remove extra spaces (before and after the name) and replace spaces with -
        name: request.body.name.trim().replace(" ", "-"),
        members: [{ id: user.id, permission: "admin" }]
    }

    const existingTeam = await Team.findOne({ "name": { $regex: new RegExp(team.name, "i") } })
    if (existingTeam) {
        console.log("existing team")
        return response.status(400).json({
            error: "Team name already taken"
        })
    }

    const newTeam = new Team(team)
    const savedTeam =
        await newTeam
            .save()
            .then(savedTeam => savedTeam
                .populate([
                    { path: "members.id", select: { id: 1, username: 1 } },
                    { path: "waitingMembers", select: { id: 1, username: 1 } }
                ])
            )

    user.teams = user.teams.concat(savedTeam._id)
    await user.save()

    response.status(201).json(savedTeam)
})

// UNAUTH - get every team matching the name
teamsRouter.get("/:name", async (request, response) => {
    const name = request.params.name.trim().replace(" ", "-")

    const teams = await Team
        .find({ "name": { $regex: new RegExp(name, "i") } })
    response.json(teams)
})


// --------------- INVITE SYSTEM

// AUTH - kick a member from a team
// :id / userId = id of the user to be kicked
// adminId = id of the user that kicks (needs to be admin)
// teamId = id of the team the user will be kicked from
teamsRouter.put("/kick/:id", middleware.tokenExtractor, middleware.userExtractor, async (request, response) => {
    const userId = request.params.id
    const adminId = request.user.id
    const teamId = request.body.teamId

    const team = await Team.findOne({ _id: teamId })

    if(! (team.members.find(m => m.id.toString() === adminId).permission === "admin")) {
        console.log("user not admin")
        return response.status(401).json({
            error: "User not authorized to kick"
        })
    }

    const newMembers = team.members.filter(m => m.id.toString() !== userId)
    team.members = newMembers

    const updatedTeam =
        await team
            .save()
            .then(updatedTeam => updatedTeam
                .populate([
                    { path: "members.id", select: { id: 1, username: 1 } },
                    { path: "waitingMembers", select: { id: 1, username: 1 } }
                ])
            )

    const user = await User.findOne({ _id: userId })
    const newTeams = user.teams.filter(t => t._id.toString() !== updatedTeam._id.toString())
    user.teams = newTeams
    await user.save()

    response.json(updatedTeam)
})

// AUTH - promote to admin a member
// :id / userId = id of the user to be promoted
// adminId = id of the user that promotes (needs to be admin)
// teamId = id of the team the user will be promoted in
teamsRouter.put("/promote/:id", middleware.tokenExtractor, middleware.userExtractor, async (request, response) => {
    const userId = request.params.id
    const adminId = request.user.id
    const teamId = request.body.teamId

    const team = await Team.findOne({ _id: teamId })

    if(! (team.members.find(m => m.id.toString() === adminId).permission === "admin")) {
        console.log("user not admin")
        return response.status(401).json({
            error: "User not authorized to kick"
        })
    }

    let memberToPromote = team.members.find(m => m.id.toString() === userId)
    memberToPromote.permission = "admin"
    const newMembers = team.members.filter(m => m.id.toString() !== userId).concat(memberToPromote)
    team.members = newMembers

    const updatedTeam =
        await team
            .save()
            .then(updatedTeam => updatedTeam
                .populate([
                    { path: "members.id", select: { id: 1, username: 1 } },
                    { path: "waitingMembers", select: { id: 1, username: 1 } }
                ])
            )

    response.json(updatedTeam)
})


// AUTH - add an user to waitingMember
// :id = id of the team to join
// userId = id of the user that requests to join
teamsRouter.put("/request/:id", middleware.tokenExtractor, middleware.userExtractor, async (request, response) => {
    const id = request.params.id
    const userId = request.user.id

    const user = await User.findOne({ _id: userId })

    const team = await Team.findOne({ _id: id })

    team.waitingMembers = team.waitingMembers.concat(user.id)
    const updatedTeam = await team.save()
    response.json(updatedTeam)
})

// AUTH - accept waiting user to team members
// :id / userId = id of the user to accept
// adminId = id of the user that accepts (needs to be admin)
// teamId = id of the team the user will join
teamsRouter.put("/accept/:id", middleware.tokenExtractor, middleware.userExtractor, async (request, response) => {
    const userId = request.params.id
    const adminId = request.user.id
    const teamId = request.body.teamId

    const team = await Team.findOne({ _id: teamId })

    if(! (team.members.find(m => m.id.toString() === adminId).permission === "admin")) {
        console.log("user not admin")
        return response.status(401).json({
            error: "User not authorized to accept"
        })
    }

    const newWaitingMembers = team.waitingMembers.filter(m => m.toString() !== userId)
    team.waitingMembers = newWaitingMembers

    team.members = team.members.concat({ id: userId, permission: "member" })

    const updatedTeam =
        await team
            .save()
            .then(updatedTeam => updatedTeam
                .populate([
                    { path: "members.id", select: { id: 1, username: 1 } },
                    { path: "waitingMembers", select: { id: 1, username: 1 } }
                ])
            )

    const user = await User.findOne({ _id: userId })
    user.teams = user.teams.concat(updatedTeam._id)
    await user.save()

    response.json(updatedTeam)
})

// AUTH - decline waiting user and remove it from waitingMembers
// :id / userId = id of the user to decline
// adminId = id of the user that declines (needs to be admin)
// teamId = id of the team the user will join
teamsRouter.put("/decline/:id", middleware.tokenExtractor, middleware.userExtractor, async (request, response) => {
    const userId = request.params.id
    const adminId = request.user.id
    const teamId = request.body.teamId

    const team = await Team.findOne({ _id: teamId })

    if(! (team.members.find(m => m.id.toString() === adminId).permission === "admin")) {
        console.log("user not admin")
        return response.status(401).json({
            error: "User not authorized to decline"
        })
    }

    const newWaitingMembers = team.waitingMembers.filter(m => m.toString() !== userId)
    team.waitingMembers = newWaitingMembers

    const updatedTeam =
        await team
            .save()
            .then(updatedTeam => updatedTeam
                .populate([
                    { path: "members.id", select: { id: 1, username: 1 } },
                    { path: "waitingMembers", select: { id: 1, username: 1 } }
                ])
            )
    response.json(updatedTeam)
})

// AUTH - leave a team
// userId = id of the user that leaves the team
// :id / teamId = id of the team the user will leave
teamsRouter.put("/leave/:id", middleware.tokenExtractor, middleware.userExtractor, async (request, response) => {
    const userId = request.user.id
    const teamId = request.params.id

    const team = await Team.findOne({ _id: teamId })

    if((team.members.filter(m => m.id.toString() !== userId).filter(m => m.permission === "admin")).length === 0) {
        console.log("no admins left in the team")
        return response.status(400).json({
            error: "You can't leave the team without promoting someone to admin"
        })
    }

    const newMembers = team.members.filter(m => m.id.toString() !== userId)
    team.members = newMembers

    const updatedTeam =
        await team
            .save()
            .then(updatedTeam => updatedTeam
                .populate([
                    { path: "members.id", select: { id: 1, username: 1 } },
                    { path: "waitingMembers", select: { id: 1, username: 1 } }
                ])
            )

    const user = await User.findOne({ _id: userId })
    const newUserTeams = user.teams.filter(t => t.toString() !== teamId)
    user.teams = newUserTeams

    await user.save()

    response.json(updatedTeam)
})

// AUTH - disband a team
// userId = id of the user that disbands the team (should to be admin)
// :id / teamId = id of the team the user will disband
teamsRouter.delete("/disband/:id", middleware.tokenExtractor, middleware.userExtractor, async (request, response) => {
    const userId = request.user.id
    const teamId = request.params.id

    const team = await Team.findById(teamId)

    if(! (team.members.find(m => m.id.toString() === userId).permission === "admin")) {
        console.log("user not admin")
        return response.status(401).json({
            error: "User not authorized to disband"
        })
    }

    if(team.members.length > 1) {
        console.log("user not alone in the team")
        return response.status(400).json({
            error: "You need to be alone in the team to disband it"
        })
    }

    await Team.findByIdAndRemove(teamId)

    const user = await User.findById(userId)
    const newUserTeams = user.teams.filter(t => t.toString() !== teamId)
    user.teams = newUserTeams

    await user.save()

    response.status(204).end()
})

module.exports = teamsRouter