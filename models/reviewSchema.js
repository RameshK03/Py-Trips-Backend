const mongoose = require('mongoose');
const ReviewSchema = new mongoose.Schema({
    userId: String,
    feedback: String,
    date: Date,
    image: String ,
    imageName :String
});

module.exports = mongoose.model('Review', ReviewSchema);