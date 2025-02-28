const express = require("express");
const router = express.Router();
const Beach = require("../models/beach_schema");
const upload = require("../middleware/multer");

// Upload Route
router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    console.log("Received form data:", req.body);
    console.log("Uploaded file data:", req.file);
    const { imageName, description, location, locationUrl, rating } = req.body;
    if (!imageName || !req.file) {
      return res.status(400).json({ message: "Beach name and file are required" });
    }

    const newBeach = new Beach({
      imageName,
      description: description || "",
      location: location || "",
      locationUrl: locationUrl || "",
      rating: rating ? Number(rating) : null,
      data: req.file.buffer,
      contentType: req.file.mimetype,
    });

    await newBeach.save();
    res.status(200).json({ message: "Beach Details uploaded successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while uploading the Beach Details" });
  }
});

// Fetch Beaches Details 
router.get("/", async (req, res) => {
  try {
    const beaches = await Beach.find();
    const BeachArray = beaches.map((beach) => ({
      id: beach._id,
      imageName: beach.imageName,
      description: beach.description,
      location: beach.location,
      locationUrl: beach.locationUrl,
      rating: beach.rating,
      data: beach.data ? beach.data.toString("base64") : null,
      contentType: beach.contentType,
    }));
    res.status(200).json(BeachArray);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while fetching Beach Details" });
  }
});

// Update Beach Route
router.put('/update/:id', upload.single('image'), async (req, res) => {
  try{
    const BeachId = req.params.id;
    const { imageName, description, location, locationUrl, rating,} = req.body;

    const updateData = {
    imageName : imageName || '',
    description: description || '',
    location: location || '',
    locationUrl: locationUrl || '',
    rating: rating || null, 
  };

  if (req.file) {
    updateData.data = req.file.buffer;
    updateData.contentType = req.file.mimetype;
  }

  const updatedBeach = await Beach.findByIdAndUpdate(BeachId, updateData, { new: true });

    if (!updatedBeach) {
      return res.status(404).json({ message: "Beach Details not found" });
    }
    res.status(200).json({ message: "Beach Details updated successfully", beach : updatedBeach });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while updating the Beach Details" });
  }
});

//  Delete Beach Route
router.delete("/delete/:id", async (req, res) => {
  try {
    const BeachId = req.params.id;
    const Beach_status = await Beach.findByIdAndDelete(BeachId);

    if (!Beach_status) {
      return res.status(404).json({ message: "Beach Details not found" });
    }
    res.status(200).json({ message: "Beach Details deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while deleting the Beach Details" });
  }
});

module.exports = router;
