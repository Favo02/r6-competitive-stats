const bcrypt = require("bcrypt")
const usersRouter = require("express").Router()
const User = require("../models/user")

usersRouter.post("/", async (request, response) => {
    const { username, email, password } = request.body

    const existingUsername = await User.findOne({ "username": { $regex: new RegExp(username, "i") } })
    if (existingUsername) {
        return response.status(400).json({
            error: "username taken"
        })
    }

    if (! (/^[a-zA-Z0-9](_(?!(\.|_))|\.(?!(_|\.))|[a-zA-Z0-9]){2,14}[a-zA-Z0-9]$/.test(username))) {
        return response.status(400).json({
            error: "Enter a valid username: 4-16 characters long, alpanumeric with dash and dot (- .), no consecutive special characters, no special characters at start or end"
        })
    }

    const existingEmail = await User.findOne({ "email": { $regex: new RegExp(email, "i") } })
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

module.exports = usersRouter