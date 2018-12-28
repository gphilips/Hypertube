import {
  SET_CURRENT_USER,
} from "../constants/users";
import { isEmpty } from "lodash";

const initialState = {
  currentUser: {},
  isAuth: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        currentUser: action.payload,
        isAuth: !isEmpty(action.payload),
      };
    default:
      return state;
  }
};
