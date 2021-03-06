require('dotenv').config()

module.exports = {
  MONGODB_URI: process.env.MONGODB_URI,
  PORT: process.env.PORT,
  TEST_ENV: process.env.NODE_ENV === 'test',
  JWT_SECRET: process.env.JWT_SECRET
}