const express = require('express');
const router = express.Router();
const Park = require('../models/park_schema');
const upload = require('../middleware/multer');

// upload Route
router.post('/upload', upload.single('image'), async (req, res) => {
    try{
      console.log("Received form data:", req.body);
      console.log("Uploaded file data:", req.file);
      const { imageName, description, location, locationUrl, rating } = req.body;
      if (!imageName || !req.file) {
      return res.status(400).json({ message: 'Park name and file are required' });
    }
  
    const newPark = new Park({
      imageName: imageName,  
      description: description || '',
      location: location || '',  
      locationUrl: locationUrl || '',  
      rating: rating || null, 
      data: req.file.buffer,
      contentType: req.file.mimetype
    });
  
     await newPark.save();
     res.status(200).json({ message: 'Park Details uploaded successfully' });
     }catch(err ) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while uploading the Park Details' });
      }
  });

//  fetch Route
router.get('/', async(req, res) => {
    try{
        const Parks = await Park.find();
        const ParkArray = Parks.map((park) => ({
          id: park._id,
          imageName: park.imageName,  
          description: park.description,
          location: park.location,  
          locationUrl: park.locationUrl,  
          rating: park.rating, 
          data: park.data.toString('base64'),
          contentType: park.contentType
        }));
        res.status(200).json(ParkArray);
      }catch(err){
        console.error(err);
        res.status(500).json({ error: 'An error occurred while fetching Park Details' });
      };
  });

// update Route
router.put('/update/:id', upload.single('image'), async (req, res) => {
    try{
      const ParkId = req.params.id;
      const { imageName, description, location, locationUrl, rating } = req.body;
  
    const updateData = {
      imageName: imageName,  
      description: description || '',
      location: location || '',  
      locationUrl: locationUrl || '', 
      rating: rating || null 
    };
  
   
    if (req.file) {
      updateData.data = req.file.buffer;
      updateData.contentType = req.file.mimetype;
    }
    const updatedPark = await Park.findByIdAndUpdate(ParkId, updateData, { new: true });
  
      if (!updatedPark) {
        return res.status(404).json({ message: "Park Details not found" });
      }
      res.status(200).json({ message: "Park Details updated successfully", park: updatedPark });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "An error occurred while updating the Park Details" });
    }
  });

  //  delete Route
  router.delete("/delete/:id", async (req, res) => {
    try {
      const ParkId = req.params.id;
      const Park_status = await Park.findByIdAndDelete(ParkId);
  
      if (!Park_status) {
        return res.status(404).json({ message: "Park Details not found" });
      }
      res.status(200).json({ message: "Park Details deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "An error occurred while deleting the Park Details" });
    }
  });

  module.exports = router;
