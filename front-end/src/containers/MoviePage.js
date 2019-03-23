import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import axios from "../utils/axios";
import Trailer from "../components/movie/Trailer";
import MovieInfos from "../components/movie/MovieInfos";
import Casting from "../components/movie/MovieCast";
import Comments from "../components/movie/Comments";
import MoviePoster from "../components/movie/MoviePoster";
import MoviePlayer from "../components/movie/MoviePlayer";
import timeConvert from "../utils/timeConvert";
import setAuthToken from "../utils/setAuthToken";
import { history } from "../config/store";

const Wrapper = styled.div`
  margin-top: 120px;
  margin-left: 10%;
  @media (max-width: 1024px) {
    margin-left: auto;
    margin-right: auto;
    margin-top: 90px;
    width: 90%;
  }
`;

class MoviePage extends React.Component {
  _isMounted = false;
  constructor() {
    super();
    this.state = {
      trailerId: "",
      movieRating: "",
      movieTitle: "",
      movieYear: "",
      movieRuntime: "",
      movieDescription: "",
      movieGenres: "",
      movieCast: "",
      movieRestriction: "",
      torrents: [],
      hideInfo: false,
      moviePoster: "",
      movieSrc: "",
      resolution: "",
      moviePlayerPoster: "",
      torrentHash: "",
      imdbMovieId: ""
    };
  }

  checkTorrents = async allTorrents => {
    let torrents = [];
    let lowDefTorrentHash = "";
    let highDefTorrentHash = "";
    if (allTorrents && allTorrents.en) {
      for (const elem in allTorrents.en) {
        torrents = torrents.concat(allTorrents.en[elem]);
      }
      if (torrents[0] && torrents[0].url.includes("magnet")) {
        lowDefTorrentHash = torrents[0].url.split("&")[0].split(":");
        lowDefTorrentHash = lowDefTorrentHash[lowDefTorrentHash.length - 1];
      }
      if (torrents[1] && torrents[1].url.includes("magnet")) {
        highDefTorrentHash = torrents[0].url.split("&")[0].split(":");
        highDefTorrentHash = highDefTorrentHash[highDefTorrentHash.length - 1];
      }
    } else if (allTorrents && allTorrents[0] && !allTorrents.en) {
      lowDefTorrentHash = allTorrents[0].hash;
      if (allTorrents[1]) {
        highDefTorrentHash = allTorrents[1].hash;
      }
    }
    if (this._isMounted) {
      await this.setState({
        highDefTorrentHash: highDefTorrentHash,
        lowDefTorrentHash: lowDefTorrentHash
      });
    }
  };

  componentDidMount = async () => {
    this._isMounted = true;
    let apiMovieId = this.props.match.params.apiMovieId;
    await setAuthToken(localStorage.getItem("Authorization"), false);
    return axios({
      method: "GET",
      url: `/api/moviepage/${apiMovieId}`
    })
      .then(async res => {
        if (res.data.error) {
          history.push(`/`);
        } else {
          let trailerCode = "",
            movieTitle = "",
            movieRating = "",
            movieYear = "",
            movieRuntime = "",
            movieDescription = "",
            movieGenres = "",
            movieCast = "",
            movieRestriction = "",
            torrents = [],
            moviePoster = "",
            moviePlayerPoster = "",
            imdbMovieId = "";
          if (res.data.movie.imdb_code) {
            imdbMovieId = res.data.movie.imdb_code;
          }
          if (res.data.movie.imdb_id) {
            imdbMovieId = res.data.movie.imdb_id;
          }
          if (res.data.movie.yt_trailer_code) {
            trailerCode = res.data.movie.yt_trailer_code;
          }
          if (res.data.movie.trailer) {
            let tmpTab = res.data.movie.trailer.split("/");
            tmpTab = tmpTab[tmpTab.length - 1].split("?");
            trailerCode = tmpTab[1].split("=")[1];
          }
          if (res.data.movie.title) {
            movieTitle = res.data.movie.title;
          }
          if (res.data.movie.rating) {
            if (typeof res.data.movie.rating === "object") {
              movieRating = res.data.movie.rating.percentage / 10;
            } else {
              movieRating = res.data.movie.rating;
            }
          }
          if (res.data.movie.year) {
            movieYear = res.data.movie.year;
          }
          if (res.data.movie.runtime) {
            movieRuntime = timeConvert(res.data.movie.runtime);
          }
          if (res.data.movie.description_full) {
            movieDescription = res.data.movie.description_full;
          }
          if (!res.data.movie.description_full && res.data.movie.synopsis) {
            movieDescription = res.data.movie.synopsis;
          }
          if (res.data.movie.genres) {
            movieGenres = res.data.movie.genres;
          }
          if (res.data.cast) {
            movieCast = res.data.cast;
          }
          if (res.data.movie.mpa_rating) {
            movieRestriction = res.data.movie.mpa_rating;
          }
          if (res.data.movie.torrents) {
            torrents = await this.checkTorrents(res.data.movie.torrents);
          }
          if (!trailerCode) {
            if (res.data.movie.images && res.data.movie.images.poster) {
              moviePoster = res.data.movie.images.poster;
            } else if (
              res.data.alternativeMovieData &&
              res.data.alternativeMovieData.movie_results[0].poster_path
            ) {
              moviePoster =
                "https://image.tmdb.org/t/p/original/" +
                res.data.alternativeMovieData.movie_results[0].poster_path;
            } else if (
              res.data.movie &&
              res.data.movie.background_image_original
            ) {
              moviePoster = res.data.movie.background_image_original;
            }
          }
          if (trailerCode) {
            if (
              res.data.alternativeMovieData &&
              res.data.alternativeMovieData.movie_results[0].backdrop_path
            ) {
              moviePlayerPoster =
                "https://image.tmdb.org/t/p/original/" +
                res.data.alternativeMovieData.movie_results[0].backdrop_path;
            }
          }
          if (this._isMounted) {
            await this.setState({
              trailerId: trailerCode,
              movieRating,
              movieTitle,
              movieYear,
              movieRuntime,
              movieDescription,
              movieGenres,
              movieCast,
              movieRestriction,
              torrents,
              moviePoster,
              moviePlayerPoster,
              imdbMovieId
            });
          }
        }
      })
      .catch(err => {
      });
  };

  hideInfo = resolution => {
    let movieSrc = "";
    const imdbMovieId = this.state.imdbMovieId;
    let highDefTorrentHash = this.state.highDefTorrentHash;
    let lowDefTorrentHash = this.state.lowDefTorrentHash;
    let userId = this.props.userId;
    let torrentHash = "";
    if (resolution === "1080p") {
      movieSrc = `${
        process.env.REACT_APP_API_URL
      }/api/torrent/${imdbMovieId}/${highDefTorrentHash}/${userId}`;
      torrentHash = highDefTorrentHash;
    } else {
      movieSrc = `${
        process.env.REACT_APP_API_URL
      }/api/torrent/${imdbMovieId}/${lowDefTorrentHash}/${userId}`;
      torrentHash = lowDefTorrentHash;
    }
    if (this._isMounted) {
      this.setState({
        hideInfo: !this.state.hideInfo,
        resolution,
        movieSrc,
        torrentHash
      });
    }
  };

  showInfo = () => {
    if (this._isMounted) {
      this.setState({
        hideInfo: !this.state.hideInfo
      });
    }
  };

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const movieData = {
      movieRating: this.state.movieRating,
      movieTitle: this.state.movieTitle,
      movieYear: this.state.movieYear,
      movieRuntime: this.state.movieRuntime,
      movieDescription: this.state.movieDescription,
      movieGenres: this.state.movieGenres,
      movieRestriction: this.state.movieRestriction,
      torrents: this.state.torrents
    };
    const { apiMovieId } = this.props.match.params;
    const activePlayer = this.state.hideInfo;
    const {
      movieSrc,
      highDefTorrentHash,
      lowDefTorrentHash,
      torrentHash,
      trailerId,
      moviePoster,
      movieCast,
      moviePlayerPoster,
      movieTitle,
      imdbMovieId
    } = this.state;
    return (
      imdbMovieId && (
        <div>
          <Wrapper>
            <MovieInfos
              movieData={movieData}
              hideInfo={this.hideInfo}
              activePlayer={activePlayer}
              highDefTorrentHash={highDefTorrentHash}
              lowDefTorrentHash={lowDefTorrentHash}
            />
            {trailerId ? (
              <Trailer trailerId={trailerId} activePlayer={activePlayer} />
            ) : (
              <MoviePoster
                moviePoster={moviePoster}
                activePlayer={activePlayer}
              />
            )}
            <Casting movieCast={movieCast} activePlayer={activePlayer} />
            <Comments imdbMovieId={imdbMovieId} activePlayer={activePlayer} />
          </Wrapper>
          <MoviePlayer
            imdbMovieId={imdbMovieId}
            apiMovieId={apiMovieId}
            movieSrc={movieSrc}
            activePlayer={activePlayer}
            showInfo={this.showInfo}
            moviePoster={moviePlayerPoster}
            torrentHash={torrentHash}
            movieTitle={movieTitle}
          />
        </div>
      )
    );
  }
}

const mapStateToProps = state => {
  return {
    userId: state.users.currentUser._id
  };
};

export default connect(
  mapStateToProps,
  null
)(MoviePage);
