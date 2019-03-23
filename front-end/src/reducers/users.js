import {
  SET_CURRENT_USER,
  REMOVE_CURRENT_USER,
  SET_AVATAR,
  SET_USERS_PROFILE,
  SET_CURRENT_PROFILE,
  REMOVE_CURRENT_PROFILE
} from "../constants/users";
import { isEmpty } from "lodash";

const initialState = {
  currentUser: {},
  isAuth: false,
  usersProfile: {
    profiles: [],
    hasMoreProfiles: false,
    nextProfilePage: 1
  },
  currentProfile: {
    isMe: false
  },
  avatar: "noImage"
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        currentUser: { ...state.currentUser, ...action.payload },
        isAuth: !isEmpty(action.payload)
      };
    case REMOVE_CURRENT_USER:
      return { ...state, currentUser: {}, isAuth: false };
    case SET_AVATAR:
      return {
        ...state,
        avatar: action.payload
      };
    case SET_USERS_PROFILE:
      return {
        ...state,
        usersProfile: {
          profiles: [
            ...state.usersProfile.profiles,
            ...action.payload.profiles
          ],
          hasMoreProfiles: action.payload.hasMoreProfiles,
          nextProfilePage: action.payload.nextProfilePage
        }
      };
    case SET_CURRENT_PROFILE:
      return {
        ...state,
        currentProfile: {
          ...action.payload,
          isMe: action.payload._id === state.currentUser._id
        }
      };
    case REMOVE_CURRENT_PROFILE:
      return { ...state, currentProfile: action.payload };
    default:
      return state;
  }
};
