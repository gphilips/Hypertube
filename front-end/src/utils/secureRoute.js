import React from "react";
import { Redirect, Route } from "react-router";
import jwtDecode from "jwt-decode";

const isAuthenticated = () => {
  const token = localStorage.Authorization;
  if (token) {
    const decoded = jwtDecode(token.split(' ')[1]);
    return (!!decoded.username);
  }
  return false;
};

export const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Redirect to="/sign-in" />
      )
    }
  />
);