const mongoose = require("mongoose");

const turfSchema = new mongoose.Schema({
  imageName: { type: String, required: true },
  description: { type: String },
  location: { type: String },
  locationUrl: { type: String },
  rating: { type: Number },
  phoneNo1: { type: String },
  phoneNo2: { type: String },
  data: { type: Buffer, required: true },
  contentType: { type: String, required: true },
});

module.exports = mongoose.model("Turf", turfSchema);
