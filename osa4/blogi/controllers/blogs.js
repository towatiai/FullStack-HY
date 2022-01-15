const Blog = require("../models/Blog")
const router = require('express').Router()

router.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

router.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    if (!blog) {
        response.sendStatus(404)
        return
    }
    response.json(blog)
})

router.post('/', async (request, response) => {
    const result = await (new Blog(request.body)).save()
    response.status(201).json(result)
})

router.put('/:id', async (request, response) => {
    const result = await Blog.findByIdAndUpdate(request.params.id, request.body, { new: true })
    response.status(201).json(result)
})

router.delete('/:id', async (request, response) => {
    const result = await Blog.findByIdAndRemove(request.params.id)
    response.status(200).json(result)
})

module.exports = router;