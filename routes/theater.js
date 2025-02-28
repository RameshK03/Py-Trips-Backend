const express = require('express');
const router = express.Router();
const Theater = require('../models/theater_schema');
const upload = require('../middleware/multer');

// Upload  Route
router.post("/upload", upload.single("image"), async (req, res) => {
    try {
      console.log("Received form data:", req.body);
      console.log("Uploaded file data:", req.file);
      const { imageName, description, location, locationUrl, rating } = req.body;
      if (!imageName || !req.file) {
        return res.status(400).json({ message: "Theater name and file are required" });
      }
  
      const newTheater = new Theater({
        imageName,
        description: description || "",
        location: location || "",
        locationUrl: locationUrl || "",
        rating: rating || null,
        data: req.file.buffer,
        contentType: req.file.mimetype,
      });
  
      await newTheater.save();
      res.status(200).json({ message: "Theater Details uploaded successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "An error occurred while uploading the Theater Details" });
    }
  });

// fetch route
router.get("/", async (req, res) => {
    try {
      const Theaters = await Theater.find();
      const TheaterArray = Theaters.map((theater) => ({
        id: theater._id,
        imageName: theater.imageName,
        description: theater.description,
        location: theater.location,
        locationUrl: theater.locationUrl,
        rating: theater.rating,
        data: theater.data.toString("base64"),
        contentType: theater.contentType,
      }));
      res.status(200).json(TheaterArray);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "An error occurred while fetching Theater Details" });
    }
  });

// update route
router.put("/update/:id", upload.single("image"), async (req, res) => {
    try {
      const TheaterId = req.params.id;
      const { imageName, description, location, locationUrl, rating } = req.body;
  
      const updateData = {
        imageName: imageName || "",
        description: description || "",
        location: location || "",
        locationUrl: locationUrl || "",
        rating: rating || null,
      };
  
      if (req.file) {
        updateData.data = req.file.buffer;
        updateData.contentType = req.file.mimetype;
      }
  
      const updatedTheater = await Theater.findByIdAndUpdate(TheaterId, updateData, { new: true });
  
      if (!updatedTheater) {
        return res.status(404).json({ message: "Theater Details not found" });
      }
      res.status(200).json({ message: "Theater Details updated successfully", theater: updatedTheater });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "An error occurred while updating the Theater Details" });
    }
  });

// delete route
  router.delete("/delete/:id", async (req, res) => {
    try {
      const TheaterId = req.params.id;
      const TheaterStatus = await Theater.findByIdAndDelete(TheaterId);
  
      if (!TheaterStatus) {
        return res.status(404).json({ message: "Theater Details not found" });
      }
      res.status(200).json({ message: "Theater Details deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "An error occurred while deleting the Theater Details" });
    }
  });
  
  module.exports = router;
