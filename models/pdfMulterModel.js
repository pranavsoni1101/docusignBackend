const mongoose = require('mongoose');

const pdfSchema = new mongoose.Schema({
  name: String,
  data: Buffer, // Store the binary data of the PDF file
});

const PDF = mongoose.model('PDF', pdfSchema);

module.exports = PDF;
