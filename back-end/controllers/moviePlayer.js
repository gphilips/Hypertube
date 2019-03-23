const mongoose = require("mongoose");
const User = require("../models/User");
const Movie = require("../models/Movie");
const { findIndex } = require("lodash");

exports.updateTimestamps = async (req, response) => {
  let userId = req.params.userId;
  let {
    movieHash,
    currentTime,
    isFinished,
    moviePoster,
    movieTitle,
    apiMovieId
  } = req.body;
  if (!userId || !movieHash || !currentTime || isFinished === undefined) {
    return response.json({ error: "Something is missing!" });
  } else {
    const objId = mongoose.Types.ObjectId(userId);
    await User.updateOne(
      { _id: objId, "movies.hash": movieHash },
      {
        $set: {
          "movies.$.isFinished": isFinished,
          "movies.$.currentTime": currentTime
        }
      }
    );
    if (moviePoster && movieTitle && apiMovieId) {
      Movie.findOne({ hash: movieHash }, function(err, movie) {
        if (
          movie &&
          !movie.posterPath &&
          !movie.movieTitle &&
          !movie.apiMovieId
        ) {
          Movie.updateOne(
            { hash: movieHash },
            {
              $set: {
                posterPath: moviePoster,
                movieTitle: movieTitle,
                apiMovieId: apiMovieId
              }
            },
            function(err, movie) {
              if (!err && movie && movie.nModified === 1) {
                return response.json({
                  success: "Poster successfully saved and user updated!"
                });
              } else {
                return response.json({
                  success: "Poster and title not added but timestampsOK"
                });
              }
            }
          );
        } else {
          return response.json({
            success: "Poster and title not added but timestampsOK"
          });
        }
      });
    } else {
      return response.json({
        success: "User successfully updated!"
      });
    }
  }
};

exports.getTimestamps = (req, res) => {
    const { userId, movieHash } = req.params;
    if (!userId || !movieHash) return res.send({ success: false });
    else {
      const objId = mongoose.Types.ObjectId(userId);
      User.findById(objId, (err, user) => {
        if (err || !user) {
          return res.send({ success: false });
        } else {
          const { movies } = user;
          const pos = findIndex(movies, movie => movie.hash === movieHash);
          if (pos >= 0) {
            Movie.findOne({ hash: movies[pos].hash }, (err, movie) => {
              if (err || !movie) {
                return res.send({ success: false });
              } else {
                return res.send({ success: true, movie });
              }
            });
          } else {
            return res.send({ success: false });
          }
        }
      });
    }
  };

exports.getMoviesDB = (req, res) => {
    const { userMovies } = req.body;
    const moviesDB = [];
    const promises = [];
    if (!userMovies) {
      return res.send({ success: false });
    } else {
      userMovies.forEach(movie => {
        promises.push(
          Movie.findOne({ hash: movie.hash }, (err, movieData) => {
            if (movieData && !err)
              moviesDB.push({ movie: movieData, userMovies: movie });
          })
        );
      });
      Promise.all(promises).then(() => {
        if (moviesDB && moviesDB[0])
          return res.send({ success: true, moviesDB });
        else return res.send({ success: false });
      });
    }
  };
