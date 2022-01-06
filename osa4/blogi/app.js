const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')
const { MONGODB_URI } = require('./utils/config')
const logger = require('./utils/logger')
const blogRouter = require('./controllers/blogs');
const { requestLogger, errorHandler, unknownEndpoint } = require('./utils/middleware')

mongoose.connect(MONGODB_URI).then(() => {
  logger.info('Connected to MongoDB.')
}).catch(e => {
  logger.error('Error connecting to MongoDB.', e.message)
});

const app = express()

app.use(cors())
app.use(express.json())
app.use(requestLogger)

app.use('/api/blogs/', blogRouter)

app.use(unknownEndpoint)
app.use(errorHandler)

module.exports = app