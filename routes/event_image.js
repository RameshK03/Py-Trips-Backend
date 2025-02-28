const express = require('express');
const router = express.Router();
const Event_Image = require('../models/eventimage_schema');
const upload = require('../middleware/multer');

// upload Route
router.post('/upload', upload.single('image'),  async (req, res) => {
  try{
    console.log("Received form data:", req.body);
    console.log("Uploaded file data:", req.file);
    const { imageName, description, location, locationUrl, rating, phoneNo1, phoneNo2 } = req.body;
  if (!imageName || !req.file) {
    return res.status(400).json({ message: 'Image name and file are required' });
  }

  const EventImage = new Event_Image({
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

  await EventImage.save();
  res.status(200).json({ message: "Image uploaded successfully" });
} catch (err) {
  console.error(err);
  res.status(500).json({ error: "An error occurred while uploading the image" });
}
});

// fetch Route
router.get('/', async (req, res) => {
     try{
        const Eventimages = await Event_Image.find();
        const EventImageArray = Eventimages.map(eventimage => ({
        id: eventimage._id,
        imageName: eventimage.imageName,
        description: eventimage.description,
        location: eventimage.location,
        locationUrl: eventimage.locationUrl,
        rating: eventimage.rating,
        phoneNo1: eventimage.phoneNo1, 
        phoneNo2: eventimage.phoneNo2, 
        data: eventimage.data.toString('base64'),
        contentType: eventimage.contentType
      }));
      res.status(200).json(EventImageArray);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "An error occurred while fetching images" });
    }
  });

// update Route
router.put('/update/:id', upload.single('image'), async (req, res) => {
  try{
    const EventImageId = req.params.id;
    const { imageName, description, location, locationUrl, rating, phoneNo1, phoneNo2 } = req.body;

    const updateData = {
    imageName: imageName || '',
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

  const updatedImage = await Event_Image.findByIdAndUpdate(EventImageId, updateData, { new: true });

    if (!updatedImage) {
      return res.status(404).json({ message: "Image not found" });
    }
    res.status(200).json({ message: "Image updated successfully", eventimage: updatedImage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while updating the image" });
  }
});

// delete Route
router.delete("/delete/:id", async (req, res) => {
    try {
      const imageId = req.params.id;
      const image = await Event_Image.findByIdAndDelete(imageId);
  
      if (!image) {
        return res.status(404).json({ message: "Image not found" });
      }
      res.status(200).json({ message: "Image deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "An error occurred while deleting the image" });
    }
  });
  
module.exports = router;