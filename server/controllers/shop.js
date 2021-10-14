const client = require("../config/db.config");
const gifControl = require("./gif");

/* Shop Schema */
//   {
//       _id: String,
//      shop: String,
//      initialized: Boolean,
//      accessToken: String,
//      active_gif: String
//   }

const getAllShops = () => {
  client.connect(async (err, result) => {
    if (err) {
      console.error(err);
      process.exit(-1);
    }
    const shopsCollection = client.db().collection("shops");
    const shops = await shopsCollection.find().toArray();
    return shops;
  });
};

const getShop = (shop) => {
  client.connect(async (err, result) => {
    if (err) {
      console.error(err);
      process.exit(-1);
    }
    const shopsCollection = client.db().collection("shops");
    const data = await shopsCollection.findOne({ shop });
    return data;
  });
};

const createShop = (shop, accessToken) => {
  client.connect(async (err, result) => {
    if (err) {
      console.error(err);
      process.exit(-1);
    }
    const shopsCollection = client.db().collection("shops");
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
  });
};

const updateActiveGif = (ctx) => {
  client.connect(async (err, result) => {
    if (err) {
      console.error(err);
      process.exit(-1);
    }
    const shopsCollection = client.db().collection("shops");
    const { shop, active_gif } = ctx.request.body;
    try {
      await shopsCollection.updateOne({ shop }, { $set: { active_gif } });
    } catch (err) {
      throw new Error(err);
    }
  });
};

const updateBillingStatus = (shop, billed) => {
  client.connect(async (err, result) => {
    if (err) {
      console.error(err);
      process.exit(-1);
    }
    const shopsCollection = client.db().collection("shops");
    try {
      await shopsCollection.updateOne({ shop }, { $set: { billed } });
    } catch (err) {
      throw new Error(err);
    }
  });
};

const updateInitStatus = (shop, initialized) => {
  client.connect(async (err, result) => {
    if (err) {
      console.error(err);
      process.exit(-1);
    }
    const shopsCollection = client.db().collection("shops");
    try {
      await shopsCollection.updateOne({ shop }, { $set: { initialized } });
    } catch (err) {
      throw new Error(err);
    }
  });
};

const deleteShop = (shop) => {
  client.connect(async (err, result) => {
    if (err) {
      console.error(err);
      process.exit(-1);
    }
    const shopsCollection = client.db().collection("shops");
    await gifControl.deleteShopGifs(shop);
    const { data } = await shopsCollection.deleteOne({ shop });
    return data;
  });
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
