const mongoose = require('mongoose');
const logger = require('./utils/logger');

module.exports.connect = async () => {
    await mongoose.connect(mongoUrl)
    logger.info("Connected to MongoDB.")
}