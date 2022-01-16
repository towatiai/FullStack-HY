const { TEST_ENV } = require("./config")

let silent = false

const info = (...params) => {
  if (silent) return
  // Jest gives detailed logs for failed tests, so we don't need to log everything while testing.
  !TEST_ENV && console.log(...params)
}

const error = (...params) => {
  if (silent) return
  console.error(...params)
}

const silence = (enabled) => {
  silent = enabled
}

module.exports = {
  info, error, silence
}