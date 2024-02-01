const express = require('express');
const router = express.Router();
const multer = require('multer');
const PDF = require('../models/pdfMulterModel');

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route to handle file uploads
router.post('/upload', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    // Create a new document in MongoDB
    const newPDF = new PDF({
      name: req.file.originalname,
      data: req.file.buffer,
    });
    await newPDF.save();

    return res.status(201).json({ message: 'File uploaded successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
