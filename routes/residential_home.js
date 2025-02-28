const express = require('express');
const router = express.Router();
const ResidentialHome = require('../models/residential_home_schema'); 
const upload = require('../middleware/multer');

// upload route
router.post('/upload', upload.single('image'),  async (req, res) => {
  try{
    console.log("Received form data:", req.body);
    console.log("Uploaded file data:", req.file);
    const { imageName, description, location, locationUrl, rating, phoneNo1, phoneNo2 } = req.body;
  if (!imageName || !req.file) {
    return res.status(400).json({ message: 'Residential name and file are required' });
  }

  const newResidentialHome = new ResidentialHome({
    imageName : imageName ||'',
    description: description || '',
    location: location || '',
    locationUrl: locationUrl || '',
    rating: rating || null,
    phoneNo1: phoneNo1 || '',
    phoneNo2: phoneNo2 || '', 
    data: req.file.buffer,
    contentType: req.file.mimetype
  });

  await newResidentialHome.save();
  res.status(200).json({ message: "Residential Home Details uploaded successfully" });
} catch (err) {
  console.error(err);
  res.status(500).json({ error: "An error occurred while uploading the Residential Home Details" });
}
});

// fetch route
router.get('/', async (req, res) => {
  try{
     const home = await ResidentialHome.find();
     const Residential_Home_Array = home.map(hom => ({
     id: hom._id,
     imageName: hom.imageName,
     description: hom.description,
     location: hom.location,
     locationUrl: hom.locationUrl,
     rating: hom.rating,
     phoneNo1: hom.phoneNo1, 
     phoneNo2: hom.phoneNo2, 
     data: hom.data.toString('base64'),
     contentType: hom.contentType
   }));
   res.status(200).json(Residential_Home_Array);
 } catch (err) {
   console.error(err);
   res.status(500).json({ error: "An error occurred while fetching Residential Home Details" });
 }
});

// update route
router.put('/update/:id', upload.single('image'), async (req, res) => {
  try {
    const Residential_Home_Id = req.params.id;
    const { imageName, description, location, locationUrl, rating, phoneNo1, phoneNo2 } = req.body;

    const update_Residential_Home_Data = {
      imageName: imageName ||'',
      description: description || '',
      location: location || '',
      locationUrl: locationUrl || '',
      rating: rating || null, 
      phoneNo1: phoneNo1 || '',
      phoneNo2: phoneNo2 || ''
    };

    if (req.file) {
      update_Residential_Home_Data.data = req.file.buffer;
      update_Residential_Home_Data.contentType = req.file.mimetype;
    }

    const updated_Residential_Home = await ResidentialHome.findByIdAndUpdate(
      Residential_Home_Id, 
      update_Residential_Home_Data, 
      { new: true }
    );

    if (!updated_Residential_Home) {
      return res.status(404).json({ message: "Residential Home Details not found" });
    }

    res.status(200).json({ message: "Residential Home Details updated successfully", home: updated_Residential_Home });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while updating the Residential Home Details" });
  }
});

// delete route
router.delete("/delete/:id", async (req, res) => {
  try {
    const Residential_Home_Id = req.params.id;
    const  deleted_Status= await ResidentialHome.findByIdAndDelete(Residential_Home_Id);

    if (!deleted_Status) {
      return res.status(404).json({ message: "Residential Home Details not found" });
    }
    res.status(200).json({ message: "Residential Home Details deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while deleting the Residential Home Details" });
  }
});

module.exports = router;
