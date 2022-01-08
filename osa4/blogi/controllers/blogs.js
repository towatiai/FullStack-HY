const Blog = require("../models/Blog")
const router = require('express').Router()

router.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

router.post('/', async (request, response) => {
    const result = await (new Blog(request.body)).save()
    response.status(201).json(result)
})

module.exports = router;