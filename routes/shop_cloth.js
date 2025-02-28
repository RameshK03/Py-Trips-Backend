const express = require('express');
const router = express.Router();
const ShopAccessories = require('../models/shopcloth_schema');
const upload = require('../middleware/multer');

// upload route
router.post('/upload', upload.single('image'),  async (req, res) => {
    try{
      console.log("Received form data:", req.body);
      console.log("Uploaded file data:", req.file);
      const { imageName, description, location, locationUrl, rating, phoneNo1, phoneNo2 } = req.body;
    if (!imageName || !req.file) {
      return res.status(400).json({ message: 'Shop name and file are required' });
    }
  
    const newShop = new ShopAccessories({
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
  
    await newShop.save();
    res.status(200).json({ message: "Shop Details uploaded successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while uploading the Shop Details" });
  }
  });

// fetch route
router.get('/', async (req, res) => {
    try{
       const Shops = await ShopAccessories.find();
       const ShopArray = Shops.map(shop => ({
       id: shop._id,
       imageName: shop.imageName,
       description: shop.description,
       location: shop.location,
       locationUrl: shop.locationUrl,
       rating: shop.rating,
       phoneNo1: shop.phoneNo1,
       phoneNo2: shop.phoneNo2, 
       data: shop.data.toString('base64'),
       contentType: shop.contentType
     }));
     res.status(200).json(ShopArray);
   } catch (err) {
     console.error(err);
     res.status(500).json({ error: "An error occurred while fetching Shop Details" });
   }
  });

// update route
router.put('/update/:id', upload.single('image'), async (req, res) => {
  try{
    const ShopId = req.params.id;
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

  const updatedShop = await ShopAccessories.findByIdAndUpdate(ShopId, updateData, { new: true });

    if (!updatedShop) {
      return res.status(404).json({ message: "Shop Details not found" });
    }
    res.status(200).json({ message: "Shop Details updated successfully", image: updatedShop });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while updating the Shop Details" });
  }
});

// delete route
router.delete("/delete/:id", async (req, res) => {
    try {
      const ShopId = req.params.id;
      const Shop_Status = await ShopAccessories.findByIdAndDelete(ShopId);
  
      if (!Shop_Status) {
        return res.status(404).json({ message: "Shop Details not found" });
      }
      res.status(200).json({ message: "Shop Details deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "An error occurred while deleting the Shop Details" });
    }
  });
  
module.exports = router;
