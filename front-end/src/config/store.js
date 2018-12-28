import { createBrowserHistory } from "history";
import { applyMiddleware, createStore, compose } from "redux";
import { connectRouter, routerMiddleware } from "connected-react-router";
import thunk from "redux-thunk";

import rootReducer from "../reducers";

export const history = createBrowserHistory();

const initialState = {};
const enhancers = []
const middleware = [routerMiddleware(history), thunk];

if (process.env.NODE_ENV === 'development'
  && typeof devToolsExtension === 'function')
  enhancers.push(window.__REDUX_DEVTOOLS_EXTENSION__());

const composedEnhancers = compose(
  applyMiddleware(...middleware),
  ...enhancers
)

export const store = createStore(
  connectRouter(history)(rootReducer),
  initialState,
  composedEnhancers,
);