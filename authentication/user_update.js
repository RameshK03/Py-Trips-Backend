const express = require('express');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');
const router = express.Router();

dotenv.config();

router.get('/details', async (req, res) => {
    try {
        const users = await User.find({}, '-password'); 
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
});


router.get('/details/:userId', async (req, res) => {
    try {
        const user = await User.findOne({ userId: req.params.userId }, '-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
});


router.put('/update/:userId', async (req, res) => {
    try {
        const { userImage, username, email, country, password } = req.body;
        const updateFields = { userImage, username, email, country };

        if (password) {
            updateFields.password = await bcrypt.hash(password, 10);
        }

        const updatedUser = await User.findOneAndUpdate(
            { userId: req.params.userId }, 
            updateFields,
            { new: true, select: '-password' }
        );

        if (!updatedUser) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
});


router.delete('/delete/:userId', async (req, res) => {
    try {
        const deletedUser = await User.findOneAndDelete({ userId: req.params.userId });
        if (!deletedUser) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
});

router.put('/change-password/:userId', async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = await User.findOne({ userId: req.params.userId });

        if (!user) return res.status(404).json({ message: 'User not found' });

        // Verify old password
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Old password is incorrect' });

        // Hash new password and update
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;
        await user.save();

        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
});

module.exports = router;