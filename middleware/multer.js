const multer = require("multer");

// Multer Storage (Memory) for Image Upload
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: async (req, file, cb) => {
    console.log("Received file MIME type:", file.mimetype);
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "application/octet-stream"];
    if (allowedTypes.includes(file.mimetype)) {
      return cb(null, true);
    }
    return cb(new Error("Invalid file type"), false);
  },
  limits: { fileSize: 5 * 1024 * 1024 }, 
});

module.exports = upload;