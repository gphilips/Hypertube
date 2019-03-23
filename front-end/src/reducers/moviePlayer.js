import {
  STORE_TIMESTAMPS,
  DELETE_TIMESTAMPS,
  STORE_MOVIES_DB,
  DELETE_MOVIES_DB
} from "../constants/moviePlayer";

const initialState = {
  moviesStarted: {},
  moviesDBInfo: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case STORE_TIMESTAMPS:
      return {
        ...state,
        moviesStarted: { ...state.moviesStarted, ...action.payload }
      };
    case DELETE_TIMESTAMPS:
      return {
        ...state,
        moviesStarted: {}
      };
    case STORE_MOVIES_DB:
      return {
        ...state,
        moviesDBInfo: action.payload
      };
    case DELETE_MOVIES_DB:
      return {
        ...state,
        moviesDBInfo: []
      };
    default:
      return state;
  }
};
