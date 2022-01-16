const { response } = require("../app")
const User = require("../models/User")
const router = require('express').Router()
const bcrypt = require('bcrypt')

router.post('/', async (req, res) => {
    const newUser = req.body

    if (!newUser.password || newUser.password.length < 3) {
        throw new Error('Password must be at least 3 characters long.')
    }

    const saltRounds = 10
    newUser.passwordHash = await bcrypt.hash(newUser.password, saltRounds)

    const user = await new User(newUser).save()

    res.status(201).json(user)
})

router.get('/', async (req, res) => {
    const users = await User.find({})
    res.json(users)
})


module.exports = router;