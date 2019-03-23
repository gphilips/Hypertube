import {
  SET_LIBRARY,
  CLEAN_LIBRARY,
  LOADING_LIBRARY,
  GET_FR_SUBTITLES,
  GET_EN_SUBTITLES,
  GET_DEFAULT_LANGUAGE
} from "../constants/library";

const initialState = {
  currentLibrary: [],
  totalPage: 1,
  loadingLibrary: true,
  subtitlesFr: false,
  subtitlesEn: false,
  subtitlesFrBase64: "",
  subtitlesEnBase64: "",
  defaultLanguage: "en"
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_LIBRARY:
      let movies = state.currentLibrary.concat(action.payload);
      movies = Object.values(
        movies.reduce(
          (index, item) => Object.assign(index, { [item.id]: item }),
          {}
        )
      );
      return {
        ...state,
        currentLibrary: movies,
        totalPage: action.totalPage
      };
    case CLEAN_LIBRARY:
      return {
        ...state,
        currentLibrary: []
      };
    case LOADING_LIBRARY:
      return {
        ...state,
        loadingLibrary: action.payload
      };
    case GET_FR_SUBTITLES:
      return {
        ...state,
        subtitlesFr: action.payload.subtitlesFr,
        subtitlesFrBase64: action.payload.subtitlesFrBase64
      };
    case GET_EN_SUBTITLES:
      return {
        ...state,
        subtitlesEn: action.payload.subtitlesEn,
        subtitlesEnBase64: action.payload.subtitlesEnBase64
      };
    case GET_DEFAULT_LANGUAGE:
      return {
        ...state,
        defaultLanguage: action.payload.defaultLanguage,
        subtitlesFr: action.payload.subtitlesFr,
        subtitlesFrBase64: action.payload.subtitlesFrBase64,
        subtitlesEn: action.payload.subtitlesEn,
        subtitlesEnBase64: action.payload.subtitlesEnBase64
      };
    default:
      return state;
  }
};
