const mongoose = require('mongoose');

const SignatureSchema = new mongoose.Schema({
    name: String,
    data: String,
    type: String
});

const Signature = mongoose.model("signature", SignatureSchema);

module.exports = Signature;