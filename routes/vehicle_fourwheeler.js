const express = require('express');
const router = express.Router();
const Vehicle = require('../models/vehicle_fourwheeler_schema');
const upload = require('../middleware/multer');

// upload route
router.post('/upload', upload.single('image'), (req, res) => {
  const { imageName, description, location, locationUrl, rating, phoneNo1, phoneNo2 } = req.body;

  if (!imageName || !req.file) {
    return res.status(400).json({ message: 'Vehicle name and file are required' });
  }

  const newVehicle = new Vehicle({
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

  newVehicle.save()
    .then(() => res.status(200).json({ message: 'Vehicle Details uploaded successfully' }))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'An error occurred while uploading the Vehicle Details' });
    });
});

// fetch route
router.get('/', (req, res) => {
  Vehicle.find()
    .then(Vehicles => {
      const VehicleArray = Vehicles.map(vehicle => ({
        id: vehicle._id,
        imageName: vehicle.imageName,
        description: vehicle.description,
        location: vehicle.location,
        locationUrl: vehicle.locationUrl,
        rating: vehicle.rating,
        phoneNo1: vehicle.phoneNo1, 
        phoneNo2: vehicle.phoneNo2, 
        data: vehicle.data.toString('base64'),
        contentType: vehicle.contentType
      }));
      res.status(200).json(VehicleArray);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'An error occurred while fetching Vehicle Details' });
    });
});

// update route
router.put('/update/:id', upload.single('image'), (req, res) => {
  const VehicleId = req.params.id;
  const { imageName, description, location, locationUrl, rating, phoneNo1, phoneNo2 } = req.body;

  const updateData = {
    imageName : imageName ||'',
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

  Vehicle.findByIdAndUpdate(VehicleId, updateData, { new: true })
    .then(updatedVehicle => {
      if (updatedVehicle) {
        res.status(200).json({ message: 'Vehicle Details updated successfully', vehicle: updatedVehicle });
      } else {
        res.status(404).json({ message: 'Vehicle Details not found' });
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'An error occurred while updating the Vehicle Details' });
    });
});


// delete route
router.delete('/delete/:id', (req, res) => {
  const VehicleId = req.params.id;

  Vehicle.findByIdAndDelete(VehicleId)
    .then((deletedVehicle) => {
      if (deletedVehicle) {
        res.status(200).json({ message: 'Vehicle Details deleted successfully' });
      } else {
        res.status(404).json({ message: 'Vehicle Details not found' });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'An error occurred while deleting the Vehicle Details' });
    });
});

module.exports = router;
