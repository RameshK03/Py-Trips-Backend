const mongoose = require('mongoose');

const pub_Schema = new mongoose.Schema({
  imageName: { type: String, required: true },
  description: String,
  location: String,
  locationUrl: String,
  rating: { type: Number, min: 0, max: 5 },
  phoneNo1: { type: String },
  phoneNo2: { type: String },
  data: Buffer,
  contentType: String
});

module.exports = mongoose.model('Pub', pub_Schema);