import axios from "../utils/axios";
import {
  SET_LIBRARY,
  CLEAN_LIBRARY,
  LOADING_LIBRARY,
  GET_EN_SUBTITLES,
  GET_FR_SUBTITLES,
  GET_DEFAULT_LANGUAGE
} from "../constants/library";
import { PENDING } from "../constants/users";
import createNotification from "../utils/notificationForm";

export const pending = bool => ({
  type: PENDING,
  payload: bool
});

export const setLibrary = (moviesData, totalPage) => ({
  type: SET_LIBRARY,
  payload: moviesData,
  totalPage
});

export const cleanLibrary = () => ({
  type: CLEAN_LIBRARY,
  payload: []
});

export const libraryLoading = bool => ({
  type: LOADING_LIBRARY,
  payload: bool
});

export const getSubtitlesEnAction = data => ({
  type: GET_EN_SUBTITLES,
  payload: data
});

export const getSubtitlesFrAction = data => ({
  type: GET_FR_SUBTITLES,
  payload: data
});

export const getDefaultLanguageAction = data => ({
  type: GET_DEFAULT_LANGUAGE,
  payload: data
});

export const getSortedLibrary = (
  currentPage,
  filters,
  genreProps,
  userId
) => dispatch => {
  dispatch(pending(true));
  return axios({
    method: "POST",
    url: `/api/movies/${genreProps}`,
    data: {
      filters,
      currentPage,
      userId
    }
  })
    .then(res => {
      if (res.status === 200) {
        const { success, movies, error, totalPage } = res.data;
        if (success) {
          dispatch(setLibrary(movies, totalPage));
        } else {
          error.forEach(err => createNotification("error", err.msg));
        }
      }
      dispatch(pending(false));
      return;
    })
    .catch(err => {
      dispatch(pending(false));
      return err;
    });
};

export const getDefaultLanguage = userId => dispatch => {
  return axios({
    method: "post",
    url: `/api/getDefaultLanguage`,
    data: {
      userId
    }
  })
    .then(res => {
      if (res.data.success) {
        dispatch(getDefaultLanguageAction(res.data));
        return;
      }
    })
    .catch(err => {
    });
};

export const getSubtitles = (imdbMovieId, language) => dispatch => {
  return axios({
    method: "get",
    url: `/api/getSubtitles/${imdbMovieId}/${language}`
  })
    .then(async res => {
      if (res.data.success && res.data.subtitlesEn) {
        await dispatch(getSubtitlesEnAction(res.data));
      } else if (res.data.success && res.data.subtitlesFr) {
        await dispatch(getSubtitlesFrAction(res.data));
      }
      return;
    })
    .catch(err => {
    });
};
