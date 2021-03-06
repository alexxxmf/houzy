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
import { AppHeaderSkeleton, ErrorBanner } from "./components";
import { Spin } from "antd";
import { Stripe } from "./sections/Stripe/Stripe";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY as string
);

const initialViewer: Viewer = {
  id: null,
  token: null,
  avatar: null,
  hasWallet: null,
  didRequest: false,
};

const App = () => {
  const [viewer, setViewer] = useState<Viewer>(initialViewer);
  const [logIn, { error: logInError, loading: logInLoading }] = useMutation<
    ILogInData,
    ILogInVars
  >(MUTATION_LOG_IN, {
    onCompleted: (logInData) => {
      if (logInData?.logIn) {
        setViewer(logInData.logIn);
        if (logInData?.logIn?.token) {
          sessionStorage.setItem(
            process.env.REACT_APP_CSRF_TOKEN_KEY || "",
            logInData.logIn.token
          );
        } else {
          sessionStorage.removeItem(
            process.env.REACT_APP_CSRF_TOKEN_KEY || "" || ""
          );
        }
      }
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const logInRef = useRef(logIn);

  useEffect(() => {
    logInRef.current();
  }, []);

  const logInErrorBannerElement = logInError ? (
    <ErrorBanner description="We weren't able to verify if you were logged in. Please try again later!" />
  ) : null;

  if ((!viewer.didRequest || logInLoading) && !logInError) {
    return (
      <Layout className="app-skeleton">
        <AppHeaderSkeleton />
        <div className="app-skeleton__spin-section">
          <Spin size="large" tip="Launching Houzy" />
        </div>
      </Layout>
    );
  }

  return (
    <Router>
      <Layout id="app">
        {logInErrorBannerElement}
        <AppHeader setViewer={setViewer} viewer={viewer} />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route
            exact
            path="/host"
            render={(props) => <Host {...props} viewer={viewer} />}
          />
          <Route exact path="/listings/:location?" component={Listings} />
          <Route
            exact
            path="/listing/:id"
            render={(props) => (
              <Elements stripe={stripePromise}>
                <Listing {...props} viewer={viewer} />
              </Elements>
            )}
          />
          <Route
            exact
            path="/user/:id"
            render={(props) => (
              <User {...props} viewer={viewer} setViewer={setViewer} />
            )}
          />
          <Route
            exact
            path="/login"
            render={(props) => (
              <Login {...props} setViewer={setViewer} viewer={viewer} />
            )}
          />
          <Route
            exact
            path="/stripe"
            render={(props) => (
              <Stripe {...props} setViewer={setViewer} viewer={viewer} />
            )}
          />
          <Route component={NotFound} />
        </Switch>
      </Layout>
    </Router>
  );
};

export default App;
