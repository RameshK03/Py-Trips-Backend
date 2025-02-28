const mongoose = require('mongoose');

// Define the image schema
const temple_Schema = new mongoose.Schema({
  imageName: { type: String, required: true }, 
  description: { type: String, default: '' }, 
  location: { type: String, default: ''  },  
  locationUrl: { type: String, default: '' }, 
  rating: { type: Number, min: 0, max: 5, default: null },  
  data: { type: Buffer, required: true }, 
  contentType: { type: String, required: true } 
});

module.exports= mongoose.model('temple', temple_Schema);

