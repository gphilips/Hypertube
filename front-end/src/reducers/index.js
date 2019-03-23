import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import users from "./users";
import library from "./library";
import comments from "./comments";
import moviePlayer from "./moviePlayer";

export default combineReducers({
  form: formReducer,
  users,
  library,
  comments,
  moviePlayer
});
