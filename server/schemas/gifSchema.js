const mongoose = require("mongoose");

const gifSchema = new mongoose.Schema({
  file: {
    type: String,
    required: true,
  },
  shop: {
    type: String,
    required: true,
  },
});

const Gifs = mongoose.model("gifs", gifSchema);

exports.Gifs = Gifs;
