const mongoose = require('mongoose'); // Yeh line missing hai

const platformSchema = new mongoose.Schema({
    name: { type: String, required: true },
    link: { type: String, required: true },
    price: { type: Number, required: true },
    logo: { type: String }
});

module.exports = mongoose.model('Platform', platformSchema);