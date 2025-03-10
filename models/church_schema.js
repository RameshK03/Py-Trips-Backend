const mongoose = require('mongoose');

const Church_Schema = new mongoose.Schema({
  imageName: { type: String, required: true }, 
  description: { type: String, default: '' },  
  location: { type: String, default: '' },  
  locationUrl: { type: String, default: '' }, 
  rating: {  type: Number, min: 0, max: 5,  default: null }, 
  data: { type: Buffer, required: true },  
  time :{ type : String ,   default :' '},
  contentType: { type: String,  required: true }  
});

module.exports  = mongoose.model('church', Church_Schema);
