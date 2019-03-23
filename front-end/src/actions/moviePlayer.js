import axios from "../utils/axios";
import createNotification from "../utils/notificationForm";
import {
  STORE_TIMESTAMPS,
  DELETE_TIMESTAMPS,
  STORE_MOVIES_DB,
  DELETE_MOVIES_DB
} from "../constants/moviePlayer";

export const storeTimestamps = movie => ({
  type: STORE_TIMESTAMPS,
  payload: movie
});

export const deleteTimestamps = () => ({
  type: DELETE_TIMESTAMPS
});

export const storeMoviesDB = moviesDB => ({
  type: STORE_MOVIES_DB,
  payload: moviesDB
});

export const deleteMoviesDB = () => ({
  type: DELETE_MOVIES_DB
});

export const updateMovieList = (
  movieHash,
  data,
  userId,
  moviePoster,
  movieTitle,
  apiMovieId
) => dispatch => {
  let duration = data.duration;
  let currentTime = data.currentTime;
  let isFinished = false;
  if (duration === currentTime) {
    isFinished = true;
  }
  return axios({
    method: "POST",
    url: `/api/moviePlayer/${userId}`,
    data: {
      movieHash,
      currentTime,
      isFinished,
      moviePoster,
      movieTitle,
      apiMovieId
    }
  })
    .then(res => {
      if (res.status === 200) {
        const { success } = res.data;
        if (!success) {
          createNotification(
            "error",
            "We couldn't save your current time for this movie."
          );
        } else {
          createNotification(
            "success",
            "We've saved your current time. Continue watching whenever you want!"
          );
        }
      }
      return;
    })
    .catch(err => err);
};

export const getTimestamps = (movieHash, userId) => dispatch => {
  return axios({
    method: "GET",
    url: `/api/moviePlayer/${userId}/${movieHash}`
  })
    .then(res => {
      const { success, movie } = res.data;
      if (success) {
        dispatch(storeTimestamps(movie));
      }
      return;
    })
    .catch(err => err);
};

export const getMoviesDB = userMovies => dispatch => {
  return axios({
    method: "POST",
    url: "/api/moviesDB",
    data: {
      userMovies
    }
  })
    .then(res => {
      const { success, moviesDB } = res.data;
      if (success) {
        dispatch(storeMoviesDB(moviesDB));
      }
      return;
    })
    .catch(err => err);
};
