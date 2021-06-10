const { MongoClient } = require("mongodb");
require("dotenv").config();

const connectionOptions = {
  username: process.env.MONGO_USER || "",
  password: process.env.MONGO_PASS || "",
  host: process.env.MONGO_HOST || "",
  db: process.env.MONGO_DB || "",
};

function createURI(options = connectionOptions) {
  return `mongodb://${options.host}/${options.db}?retryWrites=true&w=majority`;
  // return `mongodb://${options.username}:${options.password}@${options.host}/${options.db}`;
}

const client = new MongoClient(createURI(), {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err, result) => {
  if (err) {
    console.error(err);
    process.exit(-1);
  }

  console.log("Connected to MongoDB", isConnected());
});

const isConnected = () => {
  return !!client && !!client.topology && client.topology.isConnected();
};

module.exports = client;

// const connect = () => {
//   MongoClient.connect(
//     createURI(),
//     { useNewUrlParser: true, useUnifiedTopology: true },
//     function (err, client) {
//       if (err) {
//         console.log("Failed to connect to MongoDB");
//         throw err;
//       }
//       console.log("Connected to MongoDB...");
//       db = client.db();
//       client.close();
//     }
//   );
// };

// module.exports = { connect, db };
