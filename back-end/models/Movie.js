const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({

});

const Movie = mongoose.model('Movie', movieSchema);
module.exports = Movie;