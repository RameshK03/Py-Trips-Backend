require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../models/User');

// User Register Route
router.post('/', async (req, res) => {
    try {
        const { userImage, username, email, password, country, userId } = req.body;

        let existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'Email already in use' });

        existingUser = await User.findOne({ userId });
        if (existingUser) return res.status(400).json({ message: 'User ID already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ userImage, username, email, password: hashedPassword, country, userId });

        await newUser.save();
        res.status(201).json({ message: 'User Registered Successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
});

module.exports = router;