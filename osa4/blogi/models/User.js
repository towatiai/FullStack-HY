const mongoose = require('mongoose')

// UniqueValidator seems to have issues when updating users.
// See: https://github.com/blakehaswell/mongoose-unique-validator/issues/88
//const uniqueValidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
  username: { type: String, required: true, minLength: 3, unique: true },
  name: String,
  passwordHash: String,
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
      default: []
    }
  ],
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
  }
})

//userSchema.plugin(uniqueValidator)

module.exports = mongoose.model('User', userSchema)