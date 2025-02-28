const dotenv = require("dotenv");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const express = require('express');
const router = express.Router();
const User = require('../models/User');

dotenv.config();

// Login User
router.post('/', async (req, res) => {
    try {
        const { email, userId, password } = req.body;
        const user = await User.findOne({
            $or: [{ email }, { userId }]
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '10h' });
        res.json({ token, userId: user.userId, username: user.username });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
});

module.exports = router;