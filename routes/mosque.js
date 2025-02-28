const express = require('express');
const router = express.Router();
const Mosque = require('../models/mosque_schema');
const upload = require('../middleware/multer');

// upload Route
router.post('/upload', upload.single('image'), async (req, res) => {
    try{
      console.log("Received form data:", req.body);
      console.log("Uploaded file data:", req.file);
      const { imageName, description, location, locationUrl, rating } = req.body;
      if (!imageName || !req.file) {
      return res.status(400).json({ message: 'Mosque name and file are required' });
    }
  
    const newMosque = new Mosque({
      imageName: imageName,  
      description: description || '',
      location: location || '',  
      locationUrl: locationUrl || '',  
      rating: rating || null, 
      data: req.file.buffer,
      contentType: req.file.mimetype
    });
  
     await newMosque.save();
     res.status(200).json({ message: 'Mosque Details uploaded successfully' });
     }catch(err ) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while uploading the Mosque Details' });
      }
  });

  //  fetch Route
router.get('/', async(req, res) => {
    try{
        const Mosques = await Mosque.find();
        const MosqueArray = Mosques.map((mosque) => ({
          id: mosque._id,
          imageName: mosque.imageName,  
          description: mosque.description,
          location: mosque.location,  
          locationUrl: mosque.locationUrl,  
          rating: mosque.rating, 
          data: mosque.data.toString('base64'),
          contentType: mosque.contentType
        }));
        res.status(200).json(MosqueArray);
      }catch(err){
        console.error(err);
        res.status(500).json({ error: 'An error occurred while fetching Mosque Details' });
      };
  });

//  update Route
router.put('/update/:id', upload.single('image'), async (req, res) => {
    try{
      const MosqueId = req.params.id;
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
    const updatedMosque = await Mosque.findByIdAndUpdate(MosqueId, updateData, { new: true });
  
      if (!updatedMosque) {
        return res.status(404).json({ message: "Mosque Details not found" });
      }
      res.status(200).json({ message: "Mosque Details updated successfully", mosque: updatedMosque });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "An error occurred while updating the Mosque Details" });
    }
  });

  // delete Route
  router.delete("/delete/:id", async (req, res) => {
    try {
      const MosqueId = req.params.id;
      const Mosque_status = await Mosque.findByIdAndDelete(MosqueId);
  
      if (!Mosque_status) {
        return res.status(404).json({ message: "Mosque Details not found" });
      }
      res.status(200).json({ message: "Mosque Details deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "An error occurred while deleting the Mosque Details" });
    }
  });

  module.exports = router;

