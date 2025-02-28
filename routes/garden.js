const express = require('express');
const router = express.Router();
const Garden = require('../models/garden_schema');
const upload = require('../middleware/multer');

// upload Route
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    console.log("Received form data:", req.body);
    console.log("Uploaded file data:", req.file);

    const { imageName, description, location, locationUrl, rating, phoneNo1, phoneNo2 } = req.body;
    
    if (!imageName || !req.file) {
      return res.status(400).json({ message: 'Garden name and file are required' });
    }

    const Garden_Detail = new Garden({
      imageName,
      description: description || '',
      location: location || '',
      locationUrl: locationUrl || '',
      rating: rating || null,
      phoneNo1: phoneNo1 || '',
      phoneNo2: phoneNo2 || '',
      data: req.file.buffer,
      contentType: req.file.mimetype
    });

    await Garden_Detail.save();
    res.status(200).json({ message: "Garden Details uploaded successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while uploading the Garden Details" });
  }
});

// fetch Route
router.get('/', async (req, res) => {
  try {
    const Garden_Details = await Garden.find();
    const Garden_Array = Garden_Details.map(garden => ({
      id: garden._id,
      imageName: garden.imageName,
      description: garden.description,
      location: garden.location,
      locationUrl: garden.locationUrl,
      rating: garden.rating,
      phoneNo1: garden.phoneNo1,
      phoneNo2: garden.phoneNo2,
      data: garden.data.toString('base64'),
      contentType: garden.contentType
    }));
    res.status(200).json(Garden_Array);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while fetching Garden Details" });
  }
});

// update Route
router.put('/update/:id', upload.single('image'), async (req, res) => {
  try {
    const GardenId = req.params.id;
    const { imageName, description, location, locationUrl, rating, phoneNo1, phoneNo2 } = req.body;

    const updateData = {
      imageName : imageName || '', 
      description: description || '',
      location: location || '',
      locationUrl: locationUrl || '',
      rating: rating || null,
      phoneNo1: phoneNo1 || '',
      phoneNo2: phoneNo2 || ''
    };

    if (req.file) {
      updateData.data = req.file.buffer;
      updateData.contentType = req.file.mimetype;
    }

    const updatedDetails = await Garden.findByIdAndUpdate(GardenId, updateData, { new: true });

    if (!updatedDetails) {
      return res.status(404).json({ message: "Garden Details not found" });
    }
    res.status(200).json({ message: "Garden Details updated successfully", garden: updated_Garden_Details });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while updating the Garden Details" });
  }
});

// delete Route
router.delete("/delete/:id", async (req, res) => {
  try {
    const GardenId = req.params.id;
    const GardenStatus = await Garden.findByIdAndDelete(GardenId);

    if (!GardenStatus) {
      return res.status(404).json({ message: "Garden Details not found" });
    }
    res.status(200).json({ message: "Garden Details deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while deleting the Garden Details" });
  }
});

module.exports = router;
