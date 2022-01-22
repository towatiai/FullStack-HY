class AuthenticationError extends Error {
    constructor(messsage) {
        super(messsage)
        this.name = "AuthenticationError"
    }
}

class ValidationError extends Error {
    constructor(messsage) {
        super(messsage)
        this.name = "ValidationError"
    }
}

module.exports = { AuthenticationError, ValidationError }