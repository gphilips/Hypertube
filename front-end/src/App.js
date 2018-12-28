import React, { Component } from 'react';
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import { Redirect, Route, Switch } from "react-router";
import { ThemeProvider } from "styled-components";
import { create } from "jss";
import JssProvider from "react-jss/lib/JssProvider";
import { createGenerateClassName, jssPreset } from "@material-ui/core/styles";
import { NotificationContainer } from 'react-notifications';

import { store, history } from "./config/store";
import theme from "./config/theme";
import { PrivateRoute } from "./utils/secureRoute";

import Header from "./components/general/Header";
import HomePage from "./containers/HomePage";
// import SignUp from "./containers/SignUp";
import Login from "./containers/Login";

const styleNode = document.createComment("insertion-point-jss");
document.head.insertBefore(styleNode, document.head.firstChild);

const generateClassName = createGenerateClassName();
const jss = create({
  ...jssPreset(),
  insertionPoint: "insertion-point-jss"
});

class App extends Component {
  render() {
    return (
      <JssProvider jss={jss} generateClassName={generateClassName}>
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <ConnectedRouter history={history}>
              <div>
                <NotificationContainer />
                <Header />
                <Switch>
                  {/* <Route exact path="/sign-up" component={SignUp} /> */}
                  <Route exact path="/sign-in" component={Login} />
                  <PrivateRoute path="/" component={HomePage} />
                  <Redirect to="/" />
                </Switch>
              </div>
            </ConnectedRouter>
          </Provider>
        </ThemeProvider>
      </JssProvider>
    );
  }
}

export default App;
