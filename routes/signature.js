const express = require('express');
const router = express.Router();
const multer = require('multer');
const randomstring = require("randomstring");
const Signature = require('../models/SignatureModel');

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route to retrieve and view all Signature images
router.get('/getAll', async (req, res) => {
    try {
      const signatures = await Signature.find({});
      res.json(signatures);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  });

// To retrive one signature
router.get('/findOne/:id', async (req, res) => {
    try {
      const signature = await Signature.findById(req.params.id);
      if (!signature) {
        return res.status(404).json({ message: 'Signature not found' });
      }
      res.setHeader('Content-Type', 'image/png');
      res.send(signature.data);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
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

// to delete signatures
router.delete('/deleteSignature/:id', async (req, res) => {
    try {
      const signature = await Signature.findById(req.params.id);
      if (!signature) {
        return res.status(404).json({ message: 'signature not found' });
      }
      await signature.deleteOne();
      return res.status(200).json({ message: 'signature deleted successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  module.exports = router;
