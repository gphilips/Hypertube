export const CLEAN_LIBRARY = "CLEAN_LIBRARY";
export const LOADING_LIBRARY = "LOADING_LIBRARY";
export const GET_LIBRARY = "GET_LIBRARY";
export const SET_LIBRARY = "SET_LIBRARY";
export const ONCHANGE_YEAR_INTERVAL = "CHANGE_YEAR_INTERVAL";
export const ONCHANGE_RATING_INTERVAL = "ONCHANGE_RATING_INTERVAL";
export const ONCHANGE_KEYWORD = "ONCHANGE_KEYWORD";
export const GET_EN_SUBTITLES = "GET_EN_SUBTITLES";
export const GET_FR_SUBTITLES = "GET_FR_SUBTITLES";
export const GET_DEFAULT_LANGUAGE = "GET_DEFAULT_LANGUAGE";
export const GENRE = [
  "all",
  "comedy",
  "sci-fi",
  "horror",
  "romance",
  "action",
  "thriller",
  "drama",
  "mystery",
  "crime",
  "animation",
  "adventure"
];
export const INITIAL_SEARCH_FILTERS = {
  ratingValue: {
    min: 0,
    max: 10
  },
  yearValue: {
    min: 1915,
    max: 2019
  },
  keyword: "",
  searchByRYK: false
};

export const INITIAL_SORT_FILTERS = {
  genre: "",
  sortBy: "",
  searchByGenre: false
};

export const INITIAL_STATE = {
  currentPage: 1,
  hasMore: true,
  isLoading: true,
  prevLength: 0,
  genreProps: "",
  changeFiltersValues: false
};
