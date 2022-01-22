const express = require('express')
require('express-async-errors')
const cors = require('cors')
const { requestLogger, errorHandler, unknownEndpoint, tokenExtractor, userExtractor } = require('./utils/middleware')
const db = require('./db')

db.connect();

const app = express()

app.use(cors())
app.use(tokenExtractor)
app.use(express.json())
app.use(requestLogger)

app.use('/api/users/', require('./controllers/users'))
app.use('/api/login/', require('./controllers/login'))
app.use('/api/blogs/', userExtractor, require('./controllers/blogs'))

app.use(unknownEndpoint)
app.use(errorHandler)

module.exports = app