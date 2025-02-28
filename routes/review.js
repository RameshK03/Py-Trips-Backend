const express = require('express');
const router = express.Router();
const Review = require('../models/reviewSchema');

// Upload route
router.post('/upload', async (req, res) => {
    try {
        const { userId, feedback, date, image, imageName } = req.body; 

        if (!userId || !feedback) {
            return res.status(400).json({ error: 'userId and Review are required' });
        }

        const newReview = new Review({
            userId,
            feedback,
            date,
            image,
            imageName 
        });

        await newReview.save();
        res.status(201).json({ message: 'Review created successfully', data: newReview });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Read Feedback
router.get('/', async (req, res) => {
    try {
        const Reviews = await Review.find();
        res.json(Reviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Read Feedback by userId
router.get('/user/:userId', async (req, res) => {
    try {
        const {userId} = req.params;
        const Reviews = await Review.find({userId});
        res.json(Reviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update Feedback
router.put('/update/:id', async (req, res) => {
    try {
        const { userId, feedback, date, image, imageName } = req.body;
        const updateData = { userId, feedback, date, image, imageName };

        const updatedReview = await Review.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.json({ message: 'Review updated successfully', data: updatedReview });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete Feedback
router.delete('/delete/:id', async (req, res) => {
    try {
        await Review.findByIdAndDelete(req.params.id);
        res.json({ message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
