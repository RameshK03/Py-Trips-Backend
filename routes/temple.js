const express = require('express');
const router = express.Router(); 
const Temple = require('../models/temple_schema');
const upload = require('../middleware/multer');

// upload route
router.post('/upload', upload.single('image'), async (req, res) => {
  try{
    console.log("Received form data:", req.body);
    console.log("Uploaded file data:", req.file);
    const { imageName, description, location, locationUrl, rating } = req.body;
    if (!imageName || !req.file) {
    return res.status(400).json({ message: 'Temple name and file are required' });
  }

  const newTemple = new Temple({
    imageName: imageName,  
    description: description || '',
    location: location || '',  
    locationUrl: locationUrl || '',  
    rating: rating || null, 
    data: req.file.buffer,
    contentType: req.file.mimetype
  });

   await newTemple.save();
   res.status(200).json({ message: 'Temple Details uploaded successfully' });
   }catch(err ) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred while uploading the Temple Details' });
    }
});

// fetch route
router.get('/', async(req, res) => {
  try{
      const Temples = await Temple.find();
      const TempleArray = Temples.map((temple) => ({
        id: temple._id,
        imageName: temple.imageName,  
        description: temple.description,
        location: temple.location,  
        locationUrl: temple.locationUrl,  
        rating: temple.rating, 
        data: temple.data.toString('base64'),
        contentType: temple.contentType
      }));
      res.status(200).json(TempleArray);
    }catch(err){
      console.error(err);
      res.status(500).json({ error: 'An error occurred while fetching Temple Details' });
    };
});

// update route
router.put('/update/:id', upload.single('image'), async (req, res) => {
  try{
    const TempleId = req.params.id;
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
  const updatedTemple = await Temple.findByIdAndUpdate(TempleId, updateData, { new: true });

    if (!updatedTemple) {
      return res.status(404).json({ message: "Temple Details not found" });
    }
    res.status(200).json({ message: "Temple Details updated successfully", temple : updatedTemple });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while updating the Temple Details" });
  }
});

// delete route
router.delete("/delete/:id", async (req, res) => {
    try {
      const TempleId = req.params.id;
      const TempleStatus = await Temple.findByIdAndDelete(TempleId);
  
      if (!TempleStatus) {
        return res.status(404).json({ message: "Temple Details not found" });
      }
      res.status(200).json({ message: "Temple Details deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "An error occurred while deleting the Temple Details" });
    }
  });

  module.exports = router;


  
