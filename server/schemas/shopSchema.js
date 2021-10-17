const mongoose = require("mongoose");
// shop: String,
//      initialized: Boolean,
//      accessToken: String,
//      active_gif: String
const shopSchema = new mongoose.Schema({
  shop: {
    type: String,
    required: true,
  },
  active_gif: {
    type: String,
    required: true,
  },
  accessToken: {
    type: String,
    required: true,
  },
  billed: {
    type: Boolean,
    required: true,
  },
  initialized: {
    type: Boolean,
    required: true,
  },
});

const Shops = mongoose.model("shops", shopSchema);

exports.Shops = Shops;
