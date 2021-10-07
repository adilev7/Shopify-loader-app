const shopsCollection = require("../config/db.config").db().collection("shops");
const gifControl = require("./gif");

/* Shop Schema */
//   {
//       _id: String,
//      shop: String,
//      initialized: Boolean,
//      accessToken: String,
//      active_gif: String
//   }

const getAllShops = async () => {
  const shops = await shopsCollection.find().toArray();
  return shops;
};

const getShop = async (shop) => {
  const data = await shopsCollection.findOne({ shop });

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
  const { data } = await shopsCollection.insertOne(shopObj);
  return data;
};

const updateActiveGif = async (ctx) => {
  const { shop, active_gif } = ctx.request.body;
  try {
    await shopsCollection.updateOne({ shop }, { $set: { active_gif } });
  } catch (err) {
    throw new Error(err);
  }
};

const updateBillingStatus = async (shop, billed) => {
  try {
    await shopsCollection.updateOne({ shop }, { $set: { billed } });
  } catch (err) {
    throw new Error(err);
  }
};

const updateInitStatus = async (shop, initialized) => {
  try {
    await shopsCollection.updateOne({ shop }, { $set: { initialized } });
  } catch (err) {
    throw new Error(err);
  }
};

const deleteShop = async (shop) => {
  await gifControl.deleteShopGifs(shop);
  const { data } = await shopsCollection.deleteOne({ shop });
  return data;
};

module.exports = {
  getAllShops,
  getShop,
  createShop,
  updateActiveGif,
  updateInitStatus,
  updateBillingStatus,
  deleteShop,
};
