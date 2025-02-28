const express = require('express');
const router = express.Router();
const Restaurant = require('../models/restaurant_schema'); 
const upload = require('../middleware/multer');

// upload route
router.post('/upload', upload.single('image'),  async (req, res) => {
    try{
      console.log("Received form data:", req.body);
      console.log("Uploaded file data:", req.file);
      const { imageName, description, location, locationUrl, rating, phoneNo1, phoneNo2 } = req.body;
    if (!imageName || !req.file) {
      return res.status(400).json({ message: 'Restaurant name and file are required' });
    }
  
    const newRestaurant = new Restaurant({
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
  
    await newRestaurant.save();
    res.status(200).json({ message: "Restaurant Details uploaded successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while uploading the Restaurant Details" });
  }
  });

// fetch route
router.get('/', async (req, res) => {
    try{
       const Restaurants = await Restaurant.find();
       const RestaurantArray = Restaurants.map(restaurant => ({
       id: restaurant._id,
       imageName: restaurant.imageName,
       description: restaurant.description,
       location: restaurant.location,
       locationUrl: restaurant.locationUrl,
       rating: restaurant.rating,
       phoneNo1: restaurant.phoneNo1, 
       phoneNo2: restaurant.phoneNo2, 
       data: restaurant.data.toString('base64'),
       contentType: restaurant.contentType
     }));
     res.status(200).json(RestaurantArray);
   } catch (err) {
     console.error(err);
     res.status(500).json({ error: "An error occurred while fetching Restaurant Details" });
   }
  });
  
// update route
  router.put('/update/:id', upload.single('image'), async (req, res) => {
    try{
      const RestaurantId = req.params.id;
      const { imageName, description, location, locationUrl, rating, phoneNo1, phoneNo2 } = req.body;
  
      const updateData = {
      imageName : imageName||'',
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
  
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(RestaurantId, updateData, { new: true });
  
      if (!updatedRestaurant) {
        return res.status(404).json({ message: "Restaurant Details not found" });
      }
      res.status(200).json({ message: "Restaurant Details updated successfully", image: updatedRestaurant});
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "An error occurred while updating the Restaurant Details" });
    }
  });

// delete route
router.delete("/delete/:id", async (req, res) => {
    try {
      const RestaurantId = req.params.id;
      const Restaurantstatus = await Restaurant.findByIdAndDelete(RestaurantId);
  
      if (!Restaurantstatus) {
        return res.status(404).json({ message: "Restaurant Details not found" });
      }
      res.status(200).json({ message: "Restaurant Details deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "An error occurred while deleting the Restaurant Details" });
    }
  });
  
  module.exports = router;


