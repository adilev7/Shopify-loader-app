const shopsCollection = require("../config/db.config").db().collection("shops");

/* Shop Schema */
//   {
//       _id: String,
//      domain: String,
//      accessToken: String
//   }

const getAllShops = async () => {
  return await shopsCollection.find().toArray();
};

const getShop = async (id) => {
  return await shopsCollection.find({ _id: id }).toArray();
};

const createShop = async (shop) => {
  return await shopsCollection.insertOne(shop);
};

const updateShop = async ({ _id, accessToken }) => {
  return await shopsCollection.updateOne({ _id }, { $set: { accessToken } });
};

const deleteShop = async (id) => {
  return await shopsCollection.deleteOne({ _id: id });
};

module.exports = {
  getAllShops,
  getShop,
  createShop,
  updateShop,
  deleteShop,
};
