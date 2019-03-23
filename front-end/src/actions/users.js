import axios from "../utils/axios";
import jwtDecode from "jwt-decode";
import {
  SET_CURRENT_USER,
  REMOVE_CURRENT_USER,
  SET_AVATAR,
  SET_USERS_PROFILE,
  SET_CURRENT_PROFILE,
  REMOVE_CURRENT_PROFILE
} from "../constants/users";
import setAuthToken from "../utils/setAuthToken";
import createNotification from "../utils/notificationForm";
import { history } from "../config/store";

export const setCurrentUser = data => ({
  type: SET_CURRENT_USER,
  payload: data
});

export const removeCurrentUser = () => ({
  type: REMOVE_CURRENT_USER,
  payload: {}
});

export const setAvatar = avatar => ({
  type: SET_AVATAR,
  payload: avatar
});

export const setUsersProfile = profilesData => ({
  type: SET_USERS_PROFILE,
  payload: profilesData
});

export const setCurrentProfile = userData => ({
  type: SET_CURRENT_PROFILE,
  payload: userData
});

export const removeCurrentProfile = () => ({
  type: REMOVE_CURRENT_PROFILE,
  payload: {}
});

export const uploadAvatar = (avatar, id) => (dispatch, getState) => {
  const formData = new FormData();
  formData.append("avatar", avatar);
  return axios
    .post("/api/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    })
    .then(async res => {
      await dispatch(setAvatar(res.data.avatar));
      return;
    })
    .catch(err => {});
};

export const registerUser = authData => dispatch => {
  return axios
    .post("/api/signup", authData)
    .then(res => {
      if (res.status === 200) {
        const { success, errors } = res.data;
        if (success) {
          createNotification(
            "success",
            "Your account has been created successfully"
          );
          history.push("/sign-in");
        } else errors.forEach(err => createNotification("error", err.msg));
      } else
        createNotification(
          "warning",
          `There is an internal error (${res.status})`
        );
      return;
    })
    .catch(err => err);
};

export const getUser = token => dispatch => {
  const tokenDecoded = jwtDecode(token);
  const { username } = tokenDecoded;
  return axios
    .get(`/api/users/${username}`)
    .then(res => {
      if (res.status === 200) {
        const { success, errors, user } = res.data;
        if (success) dispatch(setCurrentUser(user));
        else {
          dispatch(logOut());
          errors.forEach(err => createNotification("error", err.msg));
        }
      } else
        createNotification(
          "warning",
          `There is an internal error (${res.status})`
        );
      return;
    })
    .catch(err => err);
};

export const verifyAuth = () => dispatch => {
  const token = localStorage.Authorization;
  setAuthToken(token || null);
  if (token) dispatch(getUser(token.split(" ")[1]));
};

export const logInUser = authData => dispatch => {
  return axios
    .post("/api/auth/local", authData)
    .then(res => {
      if (res.status === 200) {
        const { success, token, errors } = res.data;
        if (success) {
          setAuthToken(token, true);
          dispatch(getUser(token.split(" ")[1]));
          history.push("/");
        } else errors.forEach(err => createNotification("error", err.msg));
      } else
        createNotification(
          "warning",
          `There is an internal error (${res.status})`
        );
      return;
    })
    .catch(err => err);
};

export const logInWithOauth = url => dispatch => {
  const { token, error } = url;
  if (token && !error) {
    setAuthToken(token, true);
    dispatch(verifyAuth());
    history.push("/");
  } else createNotification("error", "The token is invalid");
};

export const logOut = () => dispatch => {
  setAuthToken(false);
  dispatch(removeCurrentUser());
  history.push("/sign-in");
};

export const updateUser = data => (dispatch, getState) => {
  const { _id: id } = getState().users.currentUser;
  return axios
    .put(`/api/users/${id}`, data)
    .then(res => {
      if (res.status === 200) {
        const { success, errors, user, token } = res.data;
        if (success) {
          dispatch(setCurrentUser(user));
          setAuthToken(token, true);
          dispatch(getUser(token.split(" ")[1]));
          if (data.username) {
            window.history.pushState(
              { url: `/profiles/${data.username}` },
              null,
              `/profiles/${data.username}`
            );
          }
          createNotification(
            "success",
            "Your account has been updated successfully"
          );
        } else errors.forEach(err => createNotification("error", err.msg));
      } else
        createNotification(
          "warning",
          `There is an internal error (${res.status})`
        );
      return;
    })
    .catch(err => err);
};

export const sendForgotEmail = email => dispatch => {
  return axios
    .post("/api/forgot", { email })
    .then(res => {
      if (res.status === 200) {
        const { success, errors } = res.data;
        if (success) {
          createNotification(
            "success",
            "We've sent you an email to reset your password"
          );
          history.push("/sign-in");
        } else errors.forEach(err => createNotification("error", err.msg));
      } else
        createNotification(
          "warning",
          `There is an internal error (${res.status})`
        );
      return;
    })
    .catch(err => err);
};

export const verifyAccessResetPwd = ({ username, token }) => dispatch => {
  return axios
    .get(`/api/reset?username=${username}&token=${token}`)
    .then(res => {
      if (res.status === 200) {
        const { success, errors } = res.data;
        if (!success) {
          history.push("/forgot");
          errors.forEach(err => createNotification("error", err.msg));
        }
      } else {
        history.push("/forgot");
        createNotification(
          "warning",
          `There is an internal error (${res.status})`
        );
      }
      return;
    })
    .catch(err => err);
};

export const resetPassword = (pwdData, isAuth = false) => dispatch => {
  return axios
    .post("/api/reset", pwdData)
    .then(res => {
      if (res.status === 200) {
        const { success, errors } = res.data;
        if (success) {
          createNotification(
            "success",
            "We've updated successfully your password"
          );
          if (!isAuth) history.push("/sign-in");
        } else errors.forEach(err => createNotification("error", err.msg));
      } else
        createNotification(
          "warning",
          `There is an internal error (${res.status})`
        );
      return;
    })
    .catch(err => err);
};

export const deleteAccount = () => (dispatch, getState) => {
  const { _id } = getState().users.currentUser;
  return axios
    .delete(`/api/users/${_id}`)
    .then(res => {
      if (res.status === 200) {
        const { success, errors } = res.data;
        if (success) {
          dispatch(logOut());
          createNotification(
            "success",
            "We've deleted successfully your account"
          );
        } else errors.forEach(err => createNotification("error", err.msg));
      } else
        createNotification(
          "warning",
          `There is an internal error (${res.status})`
        );
      return;
    })
    .catch(err => err);
};

export const getMoreProfiles = page => dispatch => {
  return axios
    .get(`/api/users?page=${page}`)
    .then(res => {
      if (res.status === 200) {
        const { success, errors, usersProfile } = res.data;
        if (success) {
          dispatch(setUsersProfile(usersProfile));
        } else errors.forEach(err => createNotification("error", err.msg));
      } else {
        createNotification(
          "warning",
          `There is an internal error (${res.status})`
        );
      }
      return;
    })
    .catch(err => err);
};

export const getCurrentProfile = username => dispatch => {
  dispatch(removeCurrentProfile());
  return axios
    .get(`/api/users/${username}`)
    .then(res => {
      if (res.status === 200) {
        const { success, errors, user } = res.data;
        if (success && user) dispatch(setCurrentProfile(user));
        else {
          history.push("/profiles");
          errors.forEach(err => createNotification("error", err.msg));
        }
      } else {
        createNotification(
          "warning",
          `There is an internal error (${res.status})`
        );
      }
      return;
    })
    .catch(err => err);
};
