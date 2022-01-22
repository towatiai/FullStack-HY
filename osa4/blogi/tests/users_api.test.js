const bcrypt = require('bcrypt')
const supertest = require('supertest')
const app = require('../app')
const db = require('../db')
const User = require('../models/user')
const Blog = require('../models/blog')
const logger = require('../utils/logger')

describe('Users API', () => {

    let api
    const initialUser = {
        username: 'toni',
        password: 'salasana123'
    }

    beforeAll(async () => {
        api = supertest(app)
    })

    beforeEach(async () => {
        await Blog.deleteMany({})
        await User.deleteMany({})
        const { _id } = await new User({
            username: initialUser.username,
            passwordHash: await bcrypt.hash(initialUser.password, 10)
        }).save()
        initialUser.id = _id;
    })

    afterAll(async () => {
        await db.close()
    })

    afterEach(() => {
        logger.silence(false)
    })

    test('returns users as JSON', async () => {
        const { body: users } = await api
            .get('/api/users')
            .expect(200)

        expect(users).toContainEqual(expect.objectContaining({ username: initialUser.username }))
        expect(users).not.toContainEqual({ passwordHash: expect.any(String) })
    })

    test('adds user', async () => {
        const newUser = {
            username: 'testuser',
            password: 'k324nlk234n2'
        }

        const { body: user } = await api
            .post('/api/users')
            .send(newUser)
            .expect(201)

        expect(user.username).toEqual(newUser.username)
        expect(user.passwordHash).toBeUndefined()

        const { body: users } = await api
            .get('/api/users')
            .expect(200)

        expect(users).toContainEqual(expect.objectContaining({ username: newUser.username }))
    })

    test('returns error when trying to create user without username', async () => {
        // Silences logger to not show expected errors
        // Note that jest still throws errors if tests fail
        logger.silence(true)
        const invalidUser = {
            password: 'k324nlk234n2'
        }

        await api
            .post('/api/users')
            .send(invalidUser)
            .expect(400)

        const { body: users } = await api
            .get('/api/users')
            .expect(200)

        expect(users.length).toEqual(1)
    })

    test('returns error when trying to create user without password', async () => {
        logger.silence(true)
        const invalidUser = {
            username: 'pentti99'
        }

        await api
            .post('/api/users')
            .send(invalidUser)
            .expect(400)

        const { body: users } = await api
            .get('/api/users')
            .expect(200)

        expect(users.length).toEqual(1)
    })

    test('returns error when trying to create user with invalid username', async () => {
        logger.silence(true)
        const invalidUser = {
            username: 'jk',
            password: 'd8fgd9d8fgdf7'
        }

        await api
            .post('/api/users')
            .send(invalidUser)
            .expect(400)

        const { body: users } = await api
            .get('/api/users')
            .expect(200)

        expect(users.length).toEqual(1)
    })

    test('returns error when trying to create user with invalid password', async () => {
        logger.silence(true)
        const invalidUser = {
            username: 'pentti99',
            password: 'a'
        }

        await api
            .post('/api/users')
            .send(invalidUser)
            .expect(400)

        const { body: users } = await api
            .get('/api/users')
            .expect(200)

        expect(users.length).toEqual(1)
    })

    test('returns error when trying to create user with dublicate username', async () => {
        logger.silence(true)
        const invalidUser = {
            username: initialUser.username,
            password: 'definitelyvalidpassword'
        }

        await api
            .post('/api/users')
            .send(invalidUser)
            .expect(400)

        const { body: users } = await api
            .get('/api/users')
            .expect(200)

        expect(users.length).toEqual(1)
    })

    test('returns blogs that the user has created', async () => {
        const blog = {
            title: "React patterns",
            author: "Michael Chan",
            url: "https://reactpatterns.com/",
            likes: 7,
        }

        const { body: { token }} = await api
            .post('/api/login')
            .send(initialUser)
            .expect(200)

        const { body: createdBlog } = await api
            .post('/api/blogs')
            .send(blog)
            .set({ Authorization: 'bearer ' + token })
            .expect(201)

        expect(createdBlog).toEqual(expect.objectContaining(blog))

        const { body: user } = await api
            .get('/api/users/' + initialUser.id)
            .expect(200)

        expect(user.blogs.length).toEqual(1)
        expect(user.blogs[0]).toEqual(expect.objectContaining(blog))
    })
})