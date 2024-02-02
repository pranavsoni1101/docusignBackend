const express = require('express');
const router = express.Router();
const multer = require('multer');
const randomstring = require("randomstring");
const Signature = require('../models/SignatureModel');

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route to handle signature upload
router.post('/upload', upload.single('signature'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'Please upload a signature' });
      }
  
      // Create a new document in MongoDB
      const newSignature = new Signature({
        name: req.file.originalname || randomstring.generate(10),
        data: req.file.buffer,
      });
      await newSignature.save();
  
      return res.status(201).json({ message: 'Signature File uploaded successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  module.exports = router;
