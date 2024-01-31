const mongoose = require('mongoose');
const { Schema } = mongoose;

// Create a schema for the PDF file
const pdfSchema = new Schema({
    filename: String,
    contentType: String,
    length: Number,
    uploadDate: Date,
    data: Buffer
});

// Create a model for the PDF file
const PdfModel = mongoose.model('Pdf', pdfSchema);

module.exports = PdfModel;
