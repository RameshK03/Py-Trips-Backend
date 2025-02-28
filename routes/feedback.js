const express = require('express');
const router = express.Router();
const Feedback = require('../models/feedback_schema');

router.post('/upload', async (req, res) => {
    const { userId, feedback } = req.body;
  if (!userId || !feedback) {
    return res.status(400).json({ message: "User ID and feedback are required!" });
  }
  const newFeedback = new Feedback({ userId, feedback });
  try {
    await newFeedback.save();
    res.status(201).json(newFeedback);
  } catch (err) {
    res.status(500).json({ message: 'Error saving feedback', error: err });
  }
});

router.get('/', async (req, res) => {
  try {
    const feedbacks = await Feedback.find();
    res.status(200).json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching feedbacks', error: err });
  }
});

router.delete('/delete/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const deletedFeedback = await Feedback.findByIdAndDelete(id);
    if (!deletedFeedback) {
      return res.status(404).json({ message: "Feedback not found." });
    }
    res.status(200).json({ message: "Feedback deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting feedback', error: err });
  }
});

module.exports = router;
