const express = require("express");
const Favourite = require("../models/favourite_schema");
const router = express.Router();

// upload Route
router.post("/upload", async (req, res) => {
  try {
    console.log(req.body);
    const { userId, imageName, description, location, locationUrl, rating, data } = req.body;

    const newFavourite = new Favourite({
      userId: userId || '',
      imageName: imageName || '',
      description: description || '',
      location: location || '',
      locationUrl: locationUrl || '',
      rating: rating ? Number(rating) : null,
      data: data || '',
    });

    await newFavourite.save();
    res.status(201).json(newFavourite);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// fetch Route
router.get("/users/:userId", async (req, res) => {
  try {
    const favourites = await Favourite.find({ userId: req.params.userId });
    if (!favourites.length) return res.status(404).json({ message: "No favourites found" });
    res.json(favourites);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Route
router.delete("/delete/:id", async (req, res) => {
  try {
    const deletedFavourite = await Favourite.findByIdAndDelete(req.params.id);
    if (!deletedFavourite) return res.status(404).json({ message: "Favourite not found" });
    res.json({ message: "Favourite deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
