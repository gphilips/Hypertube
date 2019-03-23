const axios = require("axios");
const https = require("https");
const User = require("../models/User");
const mongoose = require("mongoose");

var image;
function getData(url) {
  return axios.get(url).then(res => {
    image = "http://image.tmdb.org/t/p/w500" + res.data.posters[0].file_path;
    return image;
  });
}

const API_KEY = "d0608a8215c1bce4594597f909342304";

exports.getMovieInfo = (req, response) => {
  let imdbMovieId = "";
  let alternativeMovieData = "";
  let apiMovieId = "";
  let apiCall = "";
  if (req.params.apiMovieId) {
    apiMovieId = req.params.apiMovieId;
  }
  if (isNaN(apiMovieId)) {
    apiCall = "https://tv-v2.api-fetch.website/movie/" + apiMovieId;
    imdbMovieId = req.params.apiMovieId;
  } else {
    apiCall = "https://yts.am/api/v2/movie_details.json?movie_id=" + apiMovieId;
  }
  https
    .get(apiCall, res => {
      const { statusCode } = res;
      const contentType = res.headers["content-type"];
      let error;
      if (statusCode !== 200) {
        error = new Error("Request Failed.\n" + `Status Code: ${statusCode}`);
      } else if (!/^application\/json/.test(contentType)) {
        error = new Error(
          "Invalid content-type.\n" +
            `Expected application/json but received ${contentType}`
        );
      }
      if (error) {
        res.resume();
        return response.json({ error: error.message });
      }
      res.setEncoding("utf8");
      let rawData = "";
      res.on("data", chunk => {
        rawData += chunk;
      });
      res.on("end", () => {
        try {
          const parsedData = JSON.parse(rawData);
          let popCornMovies = parsedData;
          if (!isNaN(apiMovieId)) {
            imdbMovieId = parsedData.data.movie.imdb_code;
          }
          https.get(
            "https://api.themoviedb.org/3/find/" +
              imdbMovieId +
              "?api_key=" +
              API_KEY +
              "&language=en-US&external_source=imdb_id",
            tmdbData => {
              const { statusCode } = tmdbData;
              const contentType = tmdbData.headers["content-type"];
              let tmdbError;
              if (statusCode !== 200) {
                tmdbError = new Error(
                  "Request Failed.\n" + `Status Code: ${statusCode}`
                );
              } else if (!/^application\/json/.test(contentType)) {
                tmdbError = new Error(
                  "Invalid content-type.\n" +
                    `Expected application/json but received ${contentType}`
                );
              }
              if (tmdbError) {
                tmdbData.resume();
                return response.json({ error: tmdbError.message });
              }
              tmdbData.setEncoding("utf8");
              let rawData = "";
              tmdbData.on("data", chunk => {
                rawData += chunk;
              });
              tmdbData.on("end", () => {
                try {
                  const parsedTmdbData = JSON.parse(rawData);
                  alternativeMovieData = parsedTmdbData;
                  if (
                    alternativeMovieData &&
                    alternativeMovieData.movie_results[0] &&
                    alternativeMovieData.movie_results[0].id
                  ) {
                    https.get(
                      "https://api.themoviedb.org/3/movie/" +
                        alternativeMovieData.movie_results[0].id +
                        "/credits?api_key=" +
                        API_KEY,
                      castData => {
                        const { statusCode } = castData;
                        const contentType = castData.headers["content-type"];
                        let castError;
                        if (statusCode !== 200) {
                          castError = new Error(
                            "Request Failed.\n" + `Status Code: ${statusCode}`
                          );
                        } else if (!/^application\/json/.test(contentType)) {
                          castError = new Error(
                            "Invalid content-type.\n" +
                              `Expected application/json but received ${contentType}`
                          );
                        }
                        if (castError) {
                          castData.resume();
                          return response.json({ error: castError.message });
                        }
                        castData.setEncoding("utf8");
                        let rawData = "";
                        castData.on("data", chunk => {
                          rawData += chunk;
                        });
                        castData.on("end", () => {
                          try {
                            const parsedCastData = JSON.parse(rawData);
                            let movie = "";
                            if (isNaN(apiMovieId)) {
                              movie = popCornMovies;
                            } else {
                              movie = parsedData.data.movie;
                            }
                            return response.json({
                              movie,
                              alternativeMovieData,
                              cast: parsedCastData.cast,
                              success: "Movies successfully extracted!"
                            });
                          } catch (e) {
                            return response.json({ error: e.message });
                          }
                        });
                      }
                    );
                  }
                } catch (e) {
                  return response.json({ error: e.message });
                }
              });
            }
          );
        } catch (e) {
          return response.json({ error: e.message });
        }
      });
    })
    .on("error", e => {
      return response.json({ error: e.message });
    });
};

exports.getSortedLibrary = async (req, response) => {
  if (
    req.body.userId &&
    req.body.filters &&
    req.body.currentPage &&
    req.params.genre
  ) {
    let genreParams = req.params.genre;
    let currentPage = parseInt(req.body.currentPage);
    let {
      ratingValue,
      yearValue,
      keyword,
      genre,
      sortBy,
      searchByRYK,
      searchByGenre
    } = req.body.filters;
    let userId = req.body.userId;
    let userMovies = {};
    const objId = mongoose.Types.ObjectId(userId);
    await User.findOne({ _id: objId }, (err, user) => {
      userMovies = user.movies;
    });
    if ((searchByRYK || searchByGenre) && !sortBy) sortBy = "title";
    else if (!searchByRYK && !searchByGenre && !sortBy) sortBy = "rating";

    if (
      genreParams === "action" ||
      genreParams === "adventure" ||
      genreParams === "comedy"
    ) {
      let order_by = -1;
      if (sortBy === "title") {
        order_by = 1;
      }
      let url = `https://tv-v2.api-fetch.website/movies/${currentPage}?sort=${sortBy}&order=${order_by}&keywords=${keyword}&genre=${genreParams}`;
      axios
        .get(url)
        .then(async res => {
          let parsedData = res.data;
          let movieSeen = false;
          let movies = [];
          try {
            if (parsedData.length && currentPage >= 1) {
              for (key in parsedData) {
                for (index in userMovies) {
                  if (userMovies[index].imdbId === parsedData[key].imdb_id) {
                    movieSeen = true;
                  }
                }
                image = null;
                if (
                  !parsedData[key].images ||
                  JSON.stringify(parsedData[key].images) ===
                    JSON.stringify({}) ||
                  (parsedData[key].images.poster &&
                    parsedData[key].images.poster.search("http") === -1)
                ) {
                  await getData(
                    `https://api.themoviedb.org/3/movie/${
                      parsedData[key].imdb_id
                    }/images?api_key=22916e23015ab47f52d0f29fe41d36f9`
                  )
                    .then(data => {
                      if (data) image = data;
                      else image = null;
                    })
                    .catch(err => {});
                } else image = parsedData[key].images.poster;
                movies[key] = {
                  id: parsedData[key].imdb_id,
                  title: parsedData[key].title,
                  synopsis: parsedData[key].synopsis,
                  rating: parseInt(parsedData[key].rating.percentage) / 10,
                  torrents: parsedData[key].torrents,
                  year: parsedData[key].year,
                  large_cover_image: image,
                  genres: parsedData[key].genres,
                  movie_id: parsedData[key].imdb_id,
                  runtime: parsedData[key].runtime,
                  movieSeen: movieSeen
                };
                movieSeen = false;
              }
              movies = movies.filter(function(field, index) {
                return (
                  field.rating >= ratingValue.min &&
                  field.rating <= ratingValue.max &&
                  field.year >= yearValue.min &&
                  field.year <= yearValue.max
                );
              });

              return response.json({
                movies,
                success: "Movies successfully extracted!",
                totalPage: 215
              });
            } else {
              return response.json({
                movies,
                success: "Movies successfully extracted!",
                totalPage: 0
              });
            }
          } catch (e) {
            console.error(e.message);
          }
        })
        .catch(err => {
        });
    } else {
      let order_by = "desc";
      if (sortBy === "title") {
        order_by = "asc";
      }
      let url = `https://yts.am/api/v2/list_movies.json?page=${currentPage}&minimum_rating=${
        ratingValue.min
      }&sort_by=${sortBy}&order_by=${order_by}&query_term=${keyword}&limit=50`;
      if (genreParams === "animation") {
        url = url + `&genre=${genreParams}`;
      } else {
        if (genre !== "all") url = url + `&genre=${genre}`;
      }
      axios
        .get(url)
        .then(async res => {
          let parsedData = res.data.data.movies;
          let movie_count = res.data.data.movie_count;
          let movies = [];
          let movieSeen = false;
          try {
            for (key in parsedData) {
              for (index in userMovies) {
                if (userMovies[index].imdbId === parsedData[key].imdb_code) {
                  movieSeen = true;
                }
              }
              image = null;
              if (
                !parsedData[key].large_cover_image ||
                parsedData[key].large_cover_image.search("http") === -1
              ) {
                await getData(
                  `https://api.themoviedb.org/3/movie/${
                    parsedData[key].imdb_code
                  }/images?api_key=22916e23015ab47f52d0f29fe41d36f9`
                ).then(data => {
                  if (data) image = data;
                  else image = null;
                });
              } else image = parsedData[key].large_cover_image;

              movies[key] = {
                id: parsedData[key].imdb_code,
                title: parsedData[key].title,
                synopsis: parsedData[key].synopsis,
                rating: parsedData[key].rating,
                torrents: parsedData[key].torrents,
                year: parsedData[key].year,
                large_cover_image: image,
                genres: parsedData[key].genres,
                movie_id: parsedData[key].id,
                runtime: parsedData[key].runtime,
                movieSeen: movieSeen
              };
              movieSeen = false;
            }
            movies = movies.filter(function(field, index) {
              return (
                field.rating >= ratingValue.min &&
                field.rating <= ratingValue.max &&
                field.year >= yearValue.min &&
                field.year <= yearValue.max
              );
            });
            movies = Array.from(new Set(movies.map(JSON.stringify))).map(
              JSON.parse
            );
            return response.json({
              movies,
              success: "Movies successfully extracted!",
              totalPage: Math.ceil(movie_count / 50)
            });
          } catch (e) {
            return response.json({ error: e.message });
          }
        })
        .catch(err => {});
    }
  } else {
    return response.status(400).json({ error: "Invalid filters or page" });
  }
};
