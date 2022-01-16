const express = require('express')
require('express-async-errors')
const cors = require('cors')
const { requestLogger, errorHandler, unknownEndpoint } = require('./utils/middleware')
const db = require('./db')

db.connect();

const app = express()

app.use(cors())
app.use(express.json())
app.use(requestLogger)

app.use('/api/users/', require('./controllers/users'))
app.use('/api/blogs/', require('./controllers/blogs'))

app.use(unknownEndpoint)
app.use(errorHandler)

module.exports = app