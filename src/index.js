import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";

const initialState = {
  user: null,
  cart: [],
};

const toursHandlers = (state = initialState, action) => {
  switch (action.type) {
    case "SET_USER": {
      state.user = action.payload;
      const nextState = { ...state, user: state.user };
      return nextState;
    }
    case "UPDATE_CART": {
      const nextState = { ...state, cart: action.payload };
      return nextState;
    }
    default: {
      return state;
    }
  }
};

const store = createStore(
  toursHandlers,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
