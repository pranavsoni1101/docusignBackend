const express = require('express');
const router = express.Router();
const multer = require('multer');
const PDF = require('../models/pdfMulterModel');

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route to retrieve and view all PDF files
router.get('/getAll', async (req, res) => {
  try {
    const pdfs = await PDF.find({});
    res.json(pdfs);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});


// To retrive pdf
router.get('/findOne/:id', async (req, res) => {
  try {
    const pdf = await PDF.findById(req.params.id);
    if (!pdf) {
      return res.status(404).json({ message: 'PDF not found' });
    }
    res.setHeader('Content-Type', 'application/pdf');
    res.send(pdf.data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

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

router.delete('/deleteFile/:id', async (req, res) => {
  try {
    const pdf = await PDF.findById(req.params.id);
    if (!pdf) {
      return res.status(404).json({ message: 'PDF not found' });
    }
    await pdf.deleteOne();
    return res.status(200).json({ message: 'PDF deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
