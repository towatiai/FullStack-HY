const { TEST_ENV, JWT_SECRET } = require('./config')
const logger = require('./logger')
const User = require('../models/User')
const jwt = require('jsonwebtoken')

const requestLogger = (request, response, next) => {
    logger.info('Method:', request.method)
    logger.info('Path:  ', request.path)
    logger.info('Body:  ', request.body)
    logger.info('---')
    next()
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
    logger.error(error.name, error.message)

    switch (error.name) {
        case 'CastError': return response.status(400).send({ error: 'Malformatted id' })
        case 'MongoServerError':
        case 'ValidationError': 
            return response.status(400).json({ error: error.message })
        case 'AuthenticationError': return response.status(401).json({ error: 'Token missing or invalid' })
        case 'JsonWebTokenError': return response.status(401).json({ error: 'Invalid token' })
    }

    next(error)
}

const tokenExtractor = (req, res, next) => {
    const authorization = req.get('Authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        const token = authorization.substring(7)
        const decodedToken = jwt.verify(token, JWT_SECRET)

        if (!token || !decodedToken.id) {
            next(new AuthenticationError())
        }

        req.token = decodedToken
        next()
        return
    }
    
    req.token = null
    next()
}

const userExtractor = async (req, res, next) => {
    req.user = req.token 
        ? await User.findById(req.token.id)
        : null

    next()
}

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler,
    tokenExtractor,
    userExtractor
}