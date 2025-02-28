const express = require('express');
const router = express.Router();
const Hospital = require('../models/hospital_schema');
const upload = require('../middleware/multer');

// upload Route
router.post('/upload', upload.single('image'),  async (req, res) => {
  try{
    console.log("Received form data:", req.body);
    console.log("Uploaded file data:", req.file);
    const { imageName, description, location, locationUrl, rating, phoneNo1, phoneNo2 } = req.body;
  if (!imageName || !req.file) {
    return res.status(400).json({ message: 'Hosiptal name and file are required' });
  }

  const newHosiptal = new Hospital({
    imageName : imageName || '',
    description: description || '',
    location: location || '',
    locationUrl: locationUrl || '',
    rating: rating || null,
    phoneNo1: phoneNo1 || '',
    phoneNo2: phoneNo2 || '', 
    data: req.file.buffer,
    contentType: req.file.mimetype
  });

  await newHosiptal.save();
  res.status(200).json({ message: "Hosiptal Details uploaded successfully" });
} catch (err) {
  console.error(err);
  res.status(500).json({ error: "An error occurred while uploading the Hosiptal Details" });
}
});

// fetch Route
router.get('/', async (req, res) => {
  try{
     const Hospitals = await Hospital.find();
     const HospitalArray = Hospitals.map(hos => ({
     id: hos._id,
     imageName: hos.imageName,
     description: hos.description,
     location: hos.location,
     locationUrl: hos.locationUrl,
     rating: hos.rating,
     phoneNo1: hos.phoneNo1, 
     phoneNo2: hos.phoneNo2, 
     data: hos.data.toString('base64'),
     contentType: hos.contentType
   }));
   res.status(200).json(HospitalArray);
 } catch (err) {
   console.error(err);
   res.status(500).json({ error: "An error occurred while fetching Hospital Details" });
 }
});

// update Route
router.put('/update/:id', upload.single('image'), async (req, res) => {
  try{
    const HospitalId = req.params.id;
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

  const updatedHospital = await Hospital.findByIdAndUpdate(HospitalId, updateData, { new: true });

    if (!updatedHospital) {
      return res.status(404).json({ message: "Hospital Details not found" });
    }
    res.status(200).json({ message: "Hospital Details updated successfully", hospital : updatedHospital });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while updating the Hospital Details" });
  }
});

// delete Route
router.delete("/delete/:id", async (req, res) => {
  try {
    const HospitalId = req.params.id;
    const Hospital_status = await Hospital.findByIdAndDelete(HospitalId);

    if (!Hospital_status) {
      return res.status(404).json({ message: "Hospital Details not found" });
    }
    res.status(200).json({ message: "Hospital Details deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while deleting the Hospital Details" });
  }
});

module.exports = router;
