import React, { Component, Fragment, Suspense, lazy } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import reduxThunk from "redux-thunk";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";
import reducers from "./components/reducers";
import "./assets/css/style.css";
import Home from "./components/collection";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  reducers,
  {},
  composeEnhancers(applyMiddleware(reduxThunk))
);
class App extends Component {
  shouldComponentUpdate() {
    return false;
  }
  render() {
    return (
      <Provider
        // store={composeEnhancers(
        //   applyMiddleware(reduxThunk)(createStore)(reducers)
        // )}
        store={store}
      >
        <Router>
          <Switch>
            <Route exact path="/" component={Home} />
          </Switch>
        </Router>
      </Provider>
    );
  }
}

export default App;
