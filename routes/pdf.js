const express = require('express');
const router = express.Router();
const multer = require('multer');
const Grid = require('gridfs-stream');
const mongoose = require('mongoose');
const PdfModel = require('../models/PdfModel');

// Connect to MongoDB using Mongoose
const conn = mongoose.connection;

// Initialize GridFS stream
let gfs;
conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('pdfs');
});

// Multer storage configuration
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route to handle PDF upload
router.post('/upload', upload.single('pdf'), async (req, res) => {
    try {
        const { originalname, mimetype, buffer } = req.file;

        // Create new document
        const newPdf = new PdfModel({
            filename: originalname,
            contentType: mimetype,
            length: buffer.length,
            uploadDate: new Date(),
            data: buffer
        });

        // Save document to MongoDB
        await newPdf.save();
        res.status(200).send('PDF uploaded successfully!');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
