const express = require('express')
require('express-async-errors')
const cors = require('cors')
const blogRouter = require('./controllers/blogs');
const { requestLogger, errorHandler, unknownEndpoint } = require('./utils/middleware')
const db = require('./db')

db.connect();

const app = express()

app.use(cors())
app.use(express.json())
app.use(requestLogger)

app.use('/api/blogs/', blogRouter)

app.use(unknownEndpoint)
app.use(errorHandler)

module.exports = app