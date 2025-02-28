const express = require('express');
const router = express.Router();
const ResidentialHotel = require('../models/residential_hotel_schema'); 
const upload = require('../middleware/multer');

// upload route
router.post('/upload', upload.single('image'),  async (req, res) => {
  try{
    console.log("Received form data:", req.body);
    console.log("Uploaded file data:", req.file);
    const { imageName, description, location, locationUrl, rating, phoneNo1, phoneNo2 } = req.body;
  if (!imageName || !req.file) {
    return res.status(400).json({ message: 'Image name and file are required' });
  }

  const newResidentalHotel = new ResidentialHotel({
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

  await newResidentalHotel.save();
  res.status(200).json({ message: "Residental Hotels Details uploaded successfully" });
} catch (err) {
  console.error(err);
  res.status(500).json({ error: "An error occurred while uploading the Residental Hotels Details" });
}
});

// fetch route
router.get('/', async (req, res) => {
  try{
     const hotels = await ResidentialHotel.find();
     const Residental_Hotel_Array = hotels.map(image => ({
     id: image._id,
     imageName: image.imageName,
     description: image.description,
     location: image.location,
     locationUrl: image.locationUrl,
     rating: image.rating,
     phoneNo1: image.phoneNo1, 
     phoneNo2: image.phoneNo2, 
     data: image.data.toString('base64'),
     contentType: image.contentType
   }));
   res.status(200).json(Residental_Hotel_Array);
 } catch (err) {
   console.error(err);
   res.status(500).json({ error: "An error occurred while fetching Residental Details" });
 }
});

// update route
router.put('/update/:id', upload.single('image'), async (req, res) => {
  try{
    const Residental_Hotel_Id = req.params.id;
    const { imageName, description, location, locationUrl, rating, phoneNo1, phoneNo2 } = req.body;

    const update_Residental_Hotel_Data = {
    imageName : imageName ||'',
    description: description || '',
    location: location || '',
    locationUrl: locationUrl || '',
    rating: rating || null,
    phoneNo1: phoneNo1 || '', 
    phoneNo2: phoneNo2 || ''  
  };

  if (req.file) {
    update_Residental_Hotel_Data.data = req.file.buffer;
    update_Residental_Hotel_Data.contentType = req.file.mimetype;
  }

  const updated_Residental_Hotel = await ResidentialHotel.findByIdAndUpdate(Residental_Hotel_Id, update_Residental_Hotel_Data, { new: true });

    if (!updated_Residental_Hotel) {
      return res.status(404).json({ message: "Residental Hotel Details not found" });
    }
    res.status(200).json({ message: "Residental Hotel Details updated successfully", hotel: updated_Residental_Hotel });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while updating the Residental Hotel Details" });
  }
});

// delete route
router.delete("/delete/:id", async (req, res) => {
  try {
    const imageId = req.params.id;
    const image = await ResidentialHotel.findByIdAndDelete(imageId);

    if (!image) {
      return res.status(404).json({ message: "Residental Hotel Details not found" });
    }
    res.status(200).json({ message: "Residental Hotel Details deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while deleting the Residental Hotel Details" });
  }
});

module.exports = router;
