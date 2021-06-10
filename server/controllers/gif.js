const gifsCollection = require("../config/db.config").db().collection("gifs");

/* Gif Schema */
//   {
//       _id: String,
//      file: String,
//      shop: String
//   }

const getAllGifs = async () => {
  return await gifsCollection.find().toArray();
};

const getGif = async (id) => {
  return await gifsCollection.find({ _id: id }).toArray();
};

const createGif = async (gif) => {
  return await gifsCollection.insertOne(gif);
};

const deleteGif = async (id) => {
  return await gifsCollection.deleteOne({ _id: id });
};

module.exports = {
  getAllGifs,
  getGif,
  createGif,
  deleteGif,
};
