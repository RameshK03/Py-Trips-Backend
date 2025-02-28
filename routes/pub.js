const express = require('express');
const router = express.Router();
const Pub = require('../models/pub_schema');
const upload = require('../middleware/multer');

// Upload Route
router.post('/upload', upload.single('image'),  async (req, res) => {
    try{
      console.log("Received form data:", req.body);
      console.log("Uploaded file data:", req.file);
      const { imageName, description, location, locationUrl, rating, phoneNo1, phoneNo2 } = req.body;
    if (!imageName || !req.file) {
      return res.status(400).json({ message: 'Pub name and file are required' });
    }
  
    const newPub = new Pub({
      imageName: imageName ||``,
      description: description || '',
      location: location || '',
      locationUrl: locationUrl || '',
      rating: rating || null,
      phoneNo1: phoneNo1 || '',
      phoneNo2: phoneNo2 || '', 
      data: req.file.buffer,
      contentType: req.file.mimetype,
    });
  
    await newPub.save();
    res.status(200).json({ message: "Pub Details uploaded successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while uploading the Pub Details" });
  }
  });

// Route for fetching all images
router.get('/', async (req, res) => {
    try{
       const Pubs = await Pub.find();
       const PubArray = Pubs.map(pub => ({
       id: pub._id,
       imageName: pub.imageName,
       description: pub.description,
       location: pub.location,
       locationUrl: pub.locationUrl,
       rating: pub.rating,
       phoneNo1: pub.phoneNo1, 
       phoneNo2: pub.phoneNo2, 
       data: pub.data.toString('base64'),
       contentType: pub.contentType
     }));
     res.status(200).json(PubArray);
   } catch (err) {
     console.error(err);
     res.status(500).json({ error: "An error occurred while fetching Pub Details" });
   }
  });

// Route for updating an image by ID
router.put('/update/:id', upload.single('image'), async (req, res) => {
    try{
      const PubId = req.params.id;
      const { imageName, description, location, locationUrl, rating, phoneNo1, phoneNo2 } = req.body;
  
      const updateData = {
      imageName,
      description: description || '',
      location: location || '',
      locationUrl: locationUrl || '',
      rating: rating || null,
      phoneNo1: phoneNo1 || '', 
      phoneNo2: phoneNo2 || ''  ,
    };
  
    if (req.file) {
      updateData.data = req.file.buffer;
      updateData.contentType = req.file.mimetype;
    }
  
    const updatedPub = await Pub.findByIdAndUpdate(PubId, updateData, { new: true });
  
      if (!updatedPub) {
        return res.status(404).json({ message: "Pub Details not found" });
      }
      res.status(200).json({ message: "Image updated successfully", pub : updatedPub });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "An error occurred while updating the Pub Details" });
    }
  });

// Route for deleting an image by ID
router.delete("/delete/:id", async (req, res) => {
    try {
      const PubId = req.params.id;
      const pubStatus = await Pub.findByIdAndDelete(PubId);
  
      if (!pubStatus) {
        return res.status(404).json({ message: "Pub Details not found" });
      }
      res.status(200).json({ message: "Pub Details deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "An error occurred while deleting the Pub Details" });
    }
  });
  
  module.exports = router;
