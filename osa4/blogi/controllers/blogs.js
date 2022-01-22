const Blog = require("../models/Blog")
const User = require("../models/User")
const { AuthenticationError } = require("../utils/errors")
const router = require('express').Router()

router.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user')
    response.json(blogs)
})

router.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id).populate('user')
    if (!blog) {
        response.sendStatus(404)
        return
    }
    response.json(blog)
})

router.post('/', async (request, response, next) => {
    if (!request.user) {
        // Request didn't have token that can be used to authenticate user
        // -> Adding blog is not possible
        next(new AuthenticationError("Unable to create blog. Creating a blog requires authentication."))
        return
    }

    const result = await (new Blog({...request.body, user: request.user._id})).save()

    request.user.blogs = request.user.blogs.concat(result._id)
    await request.user.save()

    response.status(201).json(result)
})

router.put('/:id', async (request, response) => {
    if (request.body.user.id) {
        request.body.user = await User.findById(request.body.user.id)._id
    }
    const result = await Blog
        .findByIdAndUpdate(request.params.id, request.body, { new: true })
        .populate('user')
    
    response.status(201).json(result)
})

router.delete('/:id', async (request, response, next) => {
    if (!request.user) {
        next(new AuthenticationError("Unable to delete blog. Deleting a blog requires authentication."))
    }

    const blog = await Blog.findById(request.params.id)

    if (!blog) {
        response.sendStatus(404)
        return
    }

    if (blog.user.toString() !== request.user.id) {
        next(new AuthenticationError("Unable to delete blog. Only the user who created the blog can delete it."))
    }

    const result = await Blog
        .findByIdAndRemove(request.params.id)
        .populate('user')
    response.status(200).json(result)
})

module.exports = router;