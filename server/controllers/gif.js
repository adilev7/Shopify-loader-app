// const gifsCollection = require("../config/db.config").db().collection("gifs");
const mongo = require("mongodb");
/* Gif Schema */
//   {
//       _id: String,
//      file: String,
//      shopUrl: String
//   }

client.connect((err, result) => {
  if (err) {
    console.error(err);
    process.exit(-1);
  }
  const gifsCollection = client.db().collection("shops");

  const getShopGifs = async (shop) => {
    const gifs = await gifsCollection
      .find({ $or: [{ shop: "-1" }, { shop }] })
      .toArray();
    return gifs;
  };

  const getGif = async (id) => {
    const _id = new mongo.ObjectID(id);
    const gif = await gifsCollection.findOne({ _id });
    return gif;
  };

  const createGif = async (gif) => {
    try {
      await gifsCollection.insertOne(gif);
    } catch (err) {
      throw new Error(err);
    }
  };

  const deleteGif = async (id) => {
    const _id = new mongo.ObjectID(id);
    const { data } = await gifsCollection.deleteOne({ _id });
    return data;
  };

  const deleteShopGifs = async (shop) => {
    const { data } = await gifsCollection.deleteMany({ shop });
    return data;
  };

  module.exports = {
    getShopGifs,
    getGif,
    createGif,
    deleteGif,
    deleteShopGifs,
  };
});
