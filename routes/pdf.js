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

// Route to retrieve all uploaded PDFs
router.get('/getAllPdfs', async (req, res) => {
    try {
        const pdfs = await PdfModel.find({});
        console.log(pdfs);
        // res.render('pdfList', { pdfs });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});


router.get('/getOne/:filename', (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
        if (!file || file.length === 0) {
            return res.status(404).json({ message: 'File not found' });
        }

        // Check if file is a PDF
        if (file.contentType === 'application/pdf') {
            const readstream = gfs.createReadStream(file.filename);
            readstream.pipe(res);
        } else {
            res.status(404).json({ message: 'Not a PDF file' });
        }
    });
});

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
