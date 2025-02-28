const express = require('express');
const router = express.Router();
const Church = require('../models/church_schema');
const upload = require('../middleware/multer');
 
//upload church details
router.post('/upload', upload.single('image'), async (req, res) => {
   try{
    console.log("Received form data:", req.body);
    console.log("Uploaded file data:", req.file);  
    const { imageName, description, location, locationUrl, rating } = req.body;
  if (!imageName || !req.file) {
    return res.status(400).json({ message: 'Church name and file are required' });
  }

  const newChurch = new Church({
    imageName: imageName,  
    description: description || '',
    location: location || '', 
    locationUrl: locationUrl || '',  
    rating: rating || null,  
    data: req.file.buffer,
    contentType: req.file.mimetype
  });

   await newChurch.save()
    res.status(200).json({ message: 'Church Details uploaded successfully' });
    }catch(err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred while uploading the Church Details' });
    }
});

//fetch church details
router.get('/', async (req, res) => {
  try{
      const churches = await Church.find();
      const ChurchArray = churches.map((church) => ({
        id: church._id,
        imageName: church.imageName,  
        description: church.description,
        location: church.location,  
        locationUrl: church.locationUrl, 
        rating: church.rating,  
        data: church.data.toString('base64'),
        contentType: church.contentType
      }));
      res.status(200).json(ChurchArray);
    }catch(err){
      console.error(err);
      res.status(500).json({ error: 'An error occurred while fetching Church Details' });
    }
});

//update church details
router.put('/update/:id', upload.single('image'), async (req, res) => {
   try{
  const churchId = req.params.id;
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

  const updatedChurch = await Church.findByIdAndUpdate(churchId, updateData, { new: true });

    if (!updatedChurch) {
      return res.status(404).json({ message: "Church Details not found" });
    }
    res.status(200).json({ message: "Church Details updated successfully", church: updatedChurch });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while updating the Church Details" });
  }
});

//delete church details
router.delete("/delete/:id", async (req, res) => {
    try {
      const churchId = req.params.id;
      const ChurchStatus = await Church.findByIdAndDelete(churchId);
  
      if (!ChurchStatus) {
        return res.status(404).json({ message: "Church Details not found" });
      }
      res.status(200).json({ message: "Church Details deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "An error occurred while deleting the Church Details" });
    }
  });

  module.exports = router;
