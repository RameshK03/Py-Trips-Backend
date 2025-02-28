const mongoose = require('mongoose');

const park_Schema = new mongoose.Schema({
  imageName: { type: String, required: true },
  description: String,  
  location: String,  
  locationUrl: String,  
  rating: { type: Number, min: 0, max: 5 },
  data: Buffer,
  contentType: String
});

module.exports= mongoose.model('Park', park_Schema);
