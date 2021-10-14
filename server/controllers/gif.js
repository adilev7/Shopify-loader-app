const client = require("../config/db.config")
const mongo = require("mongodb");
/* Gif Schema */
//   {
//       _id: String,
//      file: String,
//      shopUrl: String
//   }


const getShopGifs = async (shop) => {
  client.connect((err, result) => {
    if (err) {
      console.error(err);
      process.exit(-1);
    }
    const gifsCollection = client.db().collection("gifs");
    const gifs = await gifsCollection.find({ $or: [{ shop: "-1" }, { shop }] }).toArray();
    return gifs;
});
};

const getGif = async (id) => {
  client.connect((err, result) => {
    if (err) {
      console.error(err);
      process.exit(-1);
    }
    const gifsCollection = client.db().collection("gifs");
    const _id = new mongo.ObjectID(id);
    const gif = await gifsCollection.findOne({ _id });
    return gif;
  });
};

const createGif = async (gif) => {
  client.connect((err, result) => {
    if (err) {
      console.error(err);
      process.exit(-1);
    }
    const gifsCollection = client.db().collection("gifs");
    try {
      await gifsCollection.insertOne(gif);
    } catch (err) {
      throw new Error(err);
    }
  });
};

const deleteGif = async (id) => {
  client.connect((err, result) => {
    if (err) {
      console.error(err);
      process.exit(-1);
    }
    const gifsCollection = client.db().collection("gifs");
    const _id = new mongo.ObjectID(id);
    const { data } = await gifsCollection.deleteOne({ _id });
    return data;
  });
};

const deleteShopGifs = async (shop) => {
  client.connect((err, result) => {
    if (err) {
      console.error(err);
      process.exit(-1);
    }
    const gifsCollection = client.db().collection("gifs");
    const { data } = await gifsCollection.deleteMany({ shop });
    return data;
  });
};

module.exports = {
  getShopGifs,
  getGif,
  createGif,
  deleteGif,
  deleteShopGifs,
};
