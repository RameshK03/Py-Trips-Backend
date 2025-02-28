const mongoose = require("mongoose");

const Booking = new mongoose.Schema({
  imageName: String,
  userId: String,
  location: String,
  locationUrl: String,
  imageData: String,
  count: Number,
});

module.exports = mongoose.model("Booking", Booking);