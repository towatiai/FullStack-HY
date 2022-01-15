const supertest = require('supertest')
const db = require('../db')
const app = require('../app')
const Blog = require('../models/Blog')
const { info } = require('../utils/logger')

describe('Blogs API', () => {

    let api

    beforeAll(() => {
        api = supertest(app)
    })

    beforeEach(async () => {
        await Blog.deleteMany({})
        await Blog.insertMany(initialBlogs)
        info("Test database initialized.")
    })

    afterAll(async () => {
        await db.close()
    })

    // 4.8
    test('returns blogs as json', async () => {
        const response = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(response.body).toHaveLength(initialBlogs.length)
    })

    // 4.9
    test('returns blogs with id', async () => {
        const response = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(response.body[0].id).toBeDefined()
    })

    // 4.10
    test('adds blog', async () => {
        const newBlog = {
            title: 'Rethinking reactivity',
            author: 'Rich Harris',
            url: 'https://svelte.dev',
            likes: 69 // nice
        }

        const { body } = await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)

        expect(body.id).toBeDefined()
        expect(body).toEqual(expect.objectContaining(newBlog))

        const response = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(response.body).toHaveLength(initialBlogs.length + 1)

        // expect.objectContaining allows us to use partial equality.
        // Objects are not truly equal, because saved blog has id.
        expect(response.body).toContainEqual(expect.objectContaining(newBlog))
    })

    // 4.11
    test('initializes likes as zero if it is not given', async () => {
        const newBlog = {
            title: 'Rethinking reactivity',
            author: 'Rich Harris',
            url: 'https://svelte.dev'
            // Missing likes, not nice
        }

        const { body: { id } } = await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)

        // This fails if post doesn't return id
        expect(id).toBeDefined()

        const response = await api
            .get('/api/blogs/' + id)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        // expect.objectContaining allows us to use partial equality.
        // Objects are not truly equal, because saved blog has id.
        expect(response.body.likes).toBe(0)
    })

    // 4.12
    test('fails to add blog if its format is not correct', async () => {
        const newBlog = {
            author: 'Rich Harris',
            // Missing likes, not nice
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)
    })

    // 4.13
    test('deletes blog', async () => {
        const response = await api.get('/api/blogs')

        const blogToDelete = response.body[0]

        const deleteResponse = await api
            .delete('/api/blogs/' + blogToDelete.id)
            .expect(200)

        expect(deleteResponse.body).toEqual(blogToDelete)

        await api
            .get('/api/blogs/' + blogToDelete.id)
            .expect(404)
    })

    // 4.14
    test('updates blog', async () => {
        const { body: [blogToUpdate, ..._] } = await api.get('/api/blogs')
        blogToUpdate.title = 'Svelte patterns'
        blogToUpdate.likes = 75

        const putResponse = await api
            .put('/api/blogs/' + blogToUpdate.id)
            .send(blogToUpdate)
            .expect(201)

        expect(putResponse.body).toEqual(blogToUpdate)

        const getResponse = await api
            .get('/api/blogs/' + blogToUpdate.id)
            .expect(200)

        expect(getResponse.body).toEqual(blogToUpdate)
    })

})

// Test data
const initialBlogs = [
    {
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
    },
    {
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5
    },
    {
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12
    },
    {
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 10
    },
    {
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        likes: 0
    },
    {
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2
    }
]