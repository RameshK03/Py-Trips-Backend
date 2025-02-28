const express = require("express");
const router = express.Router();
const Booking = require("../models/booking_schema");

// upload booking 
router.post("/upload", async (req, res) => {
  try {
    console.log(req.body);
    const { imageName, userId, location, locationUrl, count, imageData } = req.body;

    if (!imageData) {
      return res.status(400).json({ error: "Image data is required" });
    }

    const newImage = new Booking({
      imageName,
      userId,
      location,
      locationUrl,
      count,
      imageData, 
    });

    await newImage.save();
    res.status(201).json({ message: "Booking Successfully", newImage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
});

// fetch booking
router.get("/:userId", async (req, res) => {
  try {
    const images = await Booking.find({ userId: req.params.userId });
    if (images.length === 0) return res.status(404).json({ message: "No Bookings found for this user" });
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// update booking
router.put("/update/:id", async (req, res) => {
  try {
    const { count } = req.body;
    const bookingId = req.params.id;
    if (!count || isNaN(count)) {
      return res.status(400).json({ error: "Valid room count is required" });
    }
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { count },
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({ message: "Booking updated successfully", updatedBooking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
});

// delete booking
router.delete("/delete/:id", async (req, res) => {
  try {
    const bookingId = req.params.id;

    const deletedBooking = await Booking.findByIdAndDelete(bookingId);

    if (!deletedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({ message: "Booking deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;