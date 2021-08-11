const gifsCollection = require("../config/db.config").db().collection("gifs");

/* Gif Schema */
//   {
//       _id: String,
//      file: String,
//      shopUrl: String
//   }

const getShopGifs = async (shop) => {
  const gifs = await gifsCollection
    .find({ $or: [{ shop: "-1" }, { shop }] })
    .toArray();
  return gifs;
};

const getGif = async (id) => {
  const gif = await gifsCollection.findOne({ _id: id });
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
  const { data } = await gifsCollection.deleteOne({ _id: id });
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
