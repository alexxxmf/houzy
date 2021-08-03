import React, { useEffect, useRef, useState } from "react";
import { useMutation } from "@apollo/client";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { MUTATION_LOG_IN } from "./graphql";
import {
  Home,
  NotFound,
  Listing,
  Listings,
  User,
  Host,
  Login,
} from "./sections";
import Layout from "antd/lib/layout";
import { Viewer } from "./types";
import { AppHeader } from "./sections/AppHeader";
import {
  logInVariables as ILogInVars,
  logIn as ILogInData,
} from "./graphql/mutations/__generated__/logIn";
import { displayErrorMessage, displaySuccessNotification } from "./utils";

const initialViewer: Viewer = {
  id: null,
  token: null,
  avatar: null,
  hasWallet: null,
  didRequest: false,
};

const App = () => {
  const [viewer, setViewer] = useState<Viewer>(initialViewer);
  const [logIn, { error: logInError }] = useMutation<ILogInData, ILogInVars>(
    MUTATION_LOG_IN,
    {
      onCompleted: (logInData) => {
        if (logInData?.logIn) {
          setViewer(logInData.logIn);

          if (logInData?.logIn?.token) {
            sessionStorage.setItem("token", logInData.logIn.token);
          } else {
            sessionStorage.removeItem("token");
          }
        }
      },
      onError: (error) => {
        console.error(error);
      },
    }
  );

  const logInRef = useRef(logIn);

  useEffect(() => {
    logInRef.current();
  }, []);

  return (
    <Layout id="app">
      <Router>
        <AppHeader setViewer={setViewer} viewer={viewer} />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/host" component={Host} />
          <Route exact path="/listings/:location?" component={Listings} />
          <Route exact path="/listing/:location" component={Listing} />
          <Route exact path="/user/:id" component={User} />
          <Route
            exact
            path="/login"
            render={(props) => <Login {...props} setViewer={setViewer} />}
          />
          <Route component={NotFound} />
        </Switch>
      </Router>
    </Layout>
  );
};

export default App;
