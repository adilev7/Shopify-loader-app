const gifsCollection = require("../config/db.config").db().collection("gifs");

/* Gif Schema */
//   {
//       _id: String,
//      file: String,
//      shopUrl: String
//   }

// const getAllGifs = async () => {
//   return await gifsCollection.find().toArray();
// };

// const getGif = async (id) => {
//   return await gifsCollection.find({ _id: id }).toArray();
// };

const getShopGifs = async (shopUrl) => {
  return await gifsCollection.find({ shopUrl }).toArray();
};

const createGif = async (gif) => {
  return await gifsCollection.insertOne(gif);
};

const deleteGif = async (id) => {
  return await gifsCollection.deleteOne({ _id: id });
};

module.exports = {
  getShopGifs,
  createGif,
  deleteGif,
};
