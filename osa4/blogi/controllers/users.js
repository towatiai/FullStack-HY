const User = require("../models/User")
const router = require('express').Router()
const bcrypt = require('bcrypt')
const { ValidationError } = require("../utils/errors")

router.post('/', async (req, res, next) => {
    const newUser = req.body

    if (!newUser.password || newUser.password.length < 3) {
        next(new ValidationError('Password must be at least 3 characters long.'))
        return
    }

    const saltRounds = 10
    newUser.passwordHash = await bcrypt.hash(newUser.password, saltRounds)

    const user = await new User(newUser).save()

    res.status(201).json(user)
})

router.get('/', async (req, res) => {
    const users = await User.find({}).populate('blogs')
    res.json(users)
})

router.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id).populate('blogs')
    res.json(user)
})


module.exports = router;