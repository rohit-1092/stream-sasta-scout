const mongoose = require('mongoose');

const movieStatSchema = new mongoose.Schema({
    movieId: { type: String, required: true, unique: true },
    views: { type: Number, default: 0 },
    totalRating: { type: Number, default: 0 }, // Saari ratings ka total
    numberOfRatings: { type: Number, default: 0 } // Kitne logon ne rate kiya
});

module.exports = mongoose.model('MovieStat', movieStatSchema);