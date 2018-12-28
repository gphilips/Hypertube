import axios from 'axios';
import jwtDecode from "jwt-decode";

import {
  PENDING,
  SET_CURRENT_USER,
} from "../constants/users";
import setAuthToken from "../utils/setAuthToken";
import createNotification from "../utils/notificationForm";
import { history } from "../config/store";

export const pending = bool => ({
  type: PENDING,
  payload: bool,
});

export const setCurrentUser = token => ({
  type: SET_CURRENT_USER,
  payload: jwtDecode(token),
});

export const removeCurrentUser = () => ({
  type: SET_CURRENT_USER,
  payload: {},
});

export const logInUser = (authData) => dispatch => {
  dispatch(pending(true));
  return axios({
    method: 'POST',
    url: '/api/auth/local',
    data: authData,
  })
    .then(res => {
      if (res.status === 200) {
        const { success, token, errors } = res.data;
        if (success) {
          setAuthToken(token);
          dispatch(setCurrentUser(token));
          history.push('/');
        }
        else
          errors.forEach(err => createNotification('error', err.msg));
      }
      else
        createNotification('warning', `There is an internal error (${res.status})`);

      dispatch(pending(false));
      return ;
    })
    .catch(err => {
      dispatch(pending(false));
      return err;
    });
};

export const logOut = () => dispatch => {
  setAuthToken(false);
  dispatch(removeCurrentUser());
};

export const verifyAuth = () => dispatch => {
  const token = localStorage.Authorization;
  if (token) dispatch(setCurrentUser(token));
};