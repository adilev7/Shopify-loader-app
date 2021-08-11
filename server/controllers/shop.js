const shopsCollection = require("../config/db.config").db().collection("shops");
const gifControl = require("./gif");

/* Shop Schema */
//   {
//       _id: String,
//      shop: String,
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

const createShop = async (shop) => {
  const appGifs = await gifControl.getShopGifs("-1");
  const shopObj = { shop, active_gif: appGifs[0]._id };
  const { data } = await shopsCollection.insertOne(shopObj);
  return data;
};

const updateShop = async ({ shop, active_gif }) => {
  try {
    await shopsCollection.updateOne({ shop }, { $set: { active_gif } });
    debugger;
  } catch (err) {
    debugger;
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
  updateShop,
  deleteShop,
};
