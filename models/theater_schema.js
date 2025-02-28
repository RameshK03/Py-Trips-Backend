const mongoose = require("mongoose");

const theaterSchema = new mongoose.Schema({
  imageName: { type: String, required: true },
  description: { type: String },
  location: { type: String },
  locationUrl: { type: String },
  rating: { type: Number },
  data: { type: Buffer, required: true },
  contentType: { type: String, required: true },
});

module.exports = mongoose.model("Theater", theaterSchema);

