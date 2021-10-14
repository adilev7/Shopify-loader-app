const { MongoClient } = require("mongodb");
require("dotenv").config();

const connectionOptions = {
  username: process.env.MONGO_USER || "",
  password: process.env.MONGO_PASS || "",
  host: process.env.MONGO_HOST || "",
  db: process.env.MONGO_DB || "",
};

function createURI(options = connectionOptions) {
  return `mongodb+srv://${options.username}:${options.password}@${options.host}/${options.db}`;
  // return `mongodb://${options.host}:27017/${options.db}?retryWrites=true&w=majority`;
  // return `mongodb://${options.username}:${options.password}@${options.host}/${options.db}`;
}

const client = new MongoClient(createURI(), {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = client;
