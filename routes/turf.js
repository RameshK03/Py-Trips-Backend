const express = require('express');
const router = express.Router();
const Turf = require('../models/turf_schema');
const upload = require('../middleware/multer');

// upload route
router.post('/upload', upload.single('image'),  async (req, res) => {
    try{
      console.log("Received form data:", req.body);
      console.log("Uploaded file data:", req.file);
      const { imageName, description, location, locationUrl, rating, phoneNo1, phoneNo2 } = req.body;
    if (!imageName || !req.file) {
      return res.status(400).json({ message: 'Turf name and file are required' });
    }
  
    const newTurf = new Turf({
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
  
    await newTurf.save();
    res.status(200).json({ message: "Turf Details uploaded successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while uploading the Turf Details" });
  }
  });

// fetch route
router.get('/', async (req, res) => {
  try{
     const turves = await Turf.find();
     const TurfArray = turves.map(turf => ({
     id: turf._id,
     imageName: turf.imageName,
     description: turf.description,
     location: turf.location,
     locationUrl: turf.locationUrl,
     rating: turf.rating,
     phoneNo1: turf.phoneNo1, 
     phoneNo2: turf.phoneNo2,
     data: turf.data.toString('base64'),
     contentType: turf.contentType,
   }));
   res.status(200).json(TurfArray);
 } catch (err) {
   console.error(err);
   res.status(500).json({ error: "An error occurred while fetching Turf Details " });
 }
});

// update route
router.put('/update/:id', upload.single('image'), async (req, res) => {
    try{
      const TurfId = req.params.id;
      const { imageName, description, location, locationUrl, rating, phoneNo1, phoneNo2 } = req.body;
  
      const updateData = {
      imageName : imageName || '',
      description: description || '',
      location: location || '',
      locationUrl: locationUrl || '',
      rating: rating || null,
      phoneNo1: phoneNo1 || '', 
      phoneNo2: phoneNo2 || '' ,
    };
  
    if (req.file) {
      updateData.data = req.file.buffer;
      updateData.contentType = req.file.mimetype;
    }
  
    const updatedTurf = await Turf.findByIdAndUpdate(TurfId, updateData, { new: true });
  
      if (!updatedTurf) {
        return res.status(404).json({ message: "Turf Details  not found" });
      }
      res.status(200).json({ message: "Turf Details updated successfully", turf : updatedTurf });
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: "An error occurred while updating the Turf Details " });
    }
  });

// delete route
router.delete("/delete/:id", async (req, res) => {
    try {
      const TurfId = req.params.id;
      const TurfStatus = await Turf.findByIdAndDelete(TurfId);
  
      if (!TurfStatus) {
        return res.status(404).json({ message: "Turf Details not found" });
      }
      res.status(200).json({ message: "Turf Details  deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "An error occurred while deleting the Turf Details " });
    }
  });
  
  module.exports = router;
  