const mongoose = require('mongoose');
const logger = require('./utils/logger');
const { MONGODB_URI, TEST_ENV } = require('./utils/config')
const mongoServer = require("./utils/mongoServer")

module.exports.connect = async () => {
    const uri = TEST_ENV 
        ? await mongoServer.create()
        : MONGODB_URI
    await mongoose.connect(uri)
    logger.info("Connected to MongoDB.")
}

module.exports.close = async () => {
    await mongoose.connection.close()
    TEST_ENV && await mongoServer.stop()
}