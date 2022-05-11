const bcrypt = require("bcrypt")
const usersRouter = require("express").Router()
const User = require("../models/user")
const middleware = require("../utils/middleware")

usersRouter.post("/", async (request, response) => {
    const { username, email, password } = request.body

    const existingUsername = await User.findOne({ "username": { $regex: new RegExp("^" + username + "$", "i") } })
    if (existingUsername) {
        return response.status(400).json({
            error: "username taken"
        })
    }

    if (! (/^[a-zA-Z0-9](_(?!(\.|_))|\.(?!(_|\.))|[a-zA-Z0-9]){2,14}[a-zA-Z0-9]$/.test(username))) {
        return response.status(400).json({
            error: "Enter a valid username: 4-16 characters long, alpanumeric with underscore and dot (_ .), no consecutive special characters, no special characters at start or end"
        })
    }

    const existingEmail = await User.findOne({ "email": { $regex: new RegExp("^" + email + "$", "i") } })
    if (existingEmail) {
        return response.status(400).json({
            error: "email taken"
        })
    }

    if (! (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
        return response.status(400).json({
            error: "Enter a valid email"
        })
    }

    if (! (/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/.test(password))) {
        return response.status(400).json({
            error: "Enter a valid password: min 8, max 16 characters, at least one letter, one number and one special character (@$!%*#?&)"
        })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        email,
        passwordHash
    })

    const savedUser = await user.save()

    response.status(201).json(savedUser)
})

usersRouter.put("/", middleware.tokenExtractor, middleware.userExtractor, async (request, response) => {
    const id = request.user.id
    const { username, email, curPassword, newPassword, newPassword2 } = request.body

    // current password check
    const user = await User.findById(id)
    const passwordCorrect =
        user === null
            ? false
            : await bcrypt.compare(curPassword, user.passwordHash)

    if (!(user && passwordCorrect)) {
        return response.status(401).json({
            error: "Current password wrong"
        })
    }

    // username already taken (not by the user editing)
    const existingUsername = await User.find({ "username": { $regex: new RegExp("^" + username + "$", "i") } })
    // filter removing current user and checking if someone else has that username
    if (existingUsername.filter(u => u._id.toString() !== user._id.toString()).length > 0) {
        return response.status(400).json({
            error: "username taken"
        })
    }

    // username validation
    if (! (/^[a-zA-Z0-9](_(?!(\.|_))|\.(?!(_|\.))|[a-zA-Z0-9]){2,14}[a-zA-Z0-9]$/.test(username))) {
        return response.status(400).json({
            error: "Enter a valid username: 4-16 characters long, alpanumeric with underscore and dot (_ .), no consecutive special characters, no special characters at start or end"
        })
    }

    // email already taken (not by the user editing)
    const existingEmail = await User.find({ "email": { $regex: new RegExp("^" + email + "$", "i") } })
    if (existingEmail.filter(u => u._id.toString() !== user._id.toString()).length > 0) {
        return response.status(400).json({
            error: "email taken"
        })
    }

    // email validation
    if (! (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
        return response.status(400).json({
            error: "Enter a valid email"
        })
    }

    // new passwords match
    if (newPassword !== newPassword2) {
        return response.status(400).json({
            error: "The new passwords don't match"
        })
    }

    // new password validation
    if (! (/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/.test(newPassword))) {
        return response.status(400).json({
            error: "Enter a valid password: min 8, max 16 characters, at least one letter, one number and one special character (@$!%*#?&)"
        })
    }

    // new password hashing
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(newPassword, saltRounds)

    // update user
    user.username = username
    user.email = email
    user.passwordHash = passwordHash

    const savedUser = await user.save()

    response.status(201).json(savedUser)
})

module.exports = usersRouter