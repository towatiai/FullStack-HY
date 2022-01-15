const { TEST_ENV } = require("./config")

const info = (...params) => {
  // Jest gives detailed logs for failed tests, so we don't need to log everything while testing.
  !TEST_ENV && console.log(...params)
}

const error = (...params) => {
  console.error(...params)
}

module.exports = {
  info, error
}