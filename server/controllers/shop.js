// const client = require("../config/db.config");
const { Shops } = require("../schemas/shopSchema");
const gifControl = require("./gif");

const getAllShops = async () => {
  const shops = await Shops.find();
  return shops;
};

const getShop = async (shop) => {
  const data = await Shops.findOne({ shop });
  return data;
};

const createShop = async (shop, accessToken) => {
  const appGifs = await gifControl.getShopGifs("-1");
  const shopObj = {
    shop,
    accessToken,
    active_gif: appGifs[0]._id,
    initialized: false,
    billed: false,
  };
  const newShop = await new Shops(shopObj);
  newShop.save();
  return newShop;
};

const updateActiveGif = async (ctx) => {
  const { shop, active_gif } = ctx.request.body;
  try {
    await Shops.updateOne({ shop }, { $set: { active_gif } });
  } catch (err) {
    throw new Error(err);
  }
};

const updateAccessToken = async (shop, accessToken) => {
  try {
    await Shops.updateOne({ shop }, { $set: { accessToken } });
  } catch (err) {
    throw new Error(err);
  }
};

const updateBillingStatus = async (shop, billed) => {
  try {
    await Shops.updateOne({ shop }, { $set: { billed } });
  } catch (err) {
    throw new Error(err);
  }
};

const updateInitStatus = async (shop, initialized) => {
  try {
    await Shops.updateOne({ shop }, { $set: { initialized } });
  } catch (err) {
    throw new Error(err);
  }
};

const deleteShop = async (shop) => {
  await gifControl.deleteShopGifs(shop);
  const { data } = await Shops.deleteOne({ shop });
  return data;
};

module.exports = {
  getAllShops,
  getShop,
  createShop,
  updateActiveGif,
  updateInitStatus,
  updateBillingStatus,
  updateAccessToken,
  deleteShop,
};
