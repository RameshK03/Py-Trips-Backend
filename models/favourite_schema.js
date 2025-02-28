const mongoose = require('mongoose');

const favouriteSchema = new mongoose.Schema({
  userId: String,
  imageName: String,
  description: String,
  location: String,
  locationUrl: String,
  rating: Number,
  data: String,
});

module.exports = mongoose.model('Favourite',favouriteSchema);

