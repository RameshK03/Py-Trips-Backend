const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    userImage: { type: String, required: true }, 
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    country: { type: String, required: true },
    userId: { type: String, required: true, unique: true }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);