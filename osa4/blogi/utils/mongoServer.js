const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod;

module.exports.create = async () => {
    mongod = await MongoMemoryServer.create();
    return mongod.getUri();
}

module.exports.stop = async () => {
    if (mongod) {
        await mongod.stop();
    } else {
        throw new Error("Unable to stop mongo server. No MongoDB instance created.")
    }
}