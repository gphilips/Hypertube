const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
	hash: {
		type: String,
		unique: true,
	},
	imdbId: String,
	torrentPath: String,
	seenAt: Number,
	isDownloading: Boolean,
	isComplete: Boolean,
	posterPath: String,
	movieTitle: String,
	apiMovieId: String,
});

const Movie = mongoose.model("Movie", movieSchema);
module.exports = Movie;
