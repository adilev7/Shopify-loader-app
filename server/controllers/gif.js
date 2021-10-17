// const client = require("../config/db.config");
// const mongo = require("mongodb");

const { Gifs } = require("../schemas/gifSchema");

const getShopGifs = async (shop) => {
  const gifs = await Gifs.find({ $or: [{ shop: "-1" }, { shop }] });
  return gifs;
};

const getGif = async (id) => {
  const gif = await Gifs.findOne({ _id: id });
  return gif;
};

const createGif = async (gif) => {
  try {
    const newGif = new Gifs(gif);
    newGif.save();
  } catch (err) {
    throw new Error(err);
  }
};

const deleteGif = async (id) => {
  const { data } = await Gifs.deleteOne({ _id: id });
  return data;
};

const deleteShopGifs = async (shop) => {
  const { data } = await Gifs.deleteMany({ shop });
  return data;
};

module.exports = {
  getShopGifs,
  getGif,
  createGif,
  deleteGif,
  deleteShopGifs,
};
