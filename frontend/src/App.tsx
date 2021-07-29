import React from "react";
import { ApolloProvider } from "@apollo/client";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { client } from "./graphql";
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

function App() {
  return (
    <ApolloProvider client={client}>
      <Layout id="App">
        <Router>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/host" component={Host} />
            <Route exact path="/listings/:location?" component={Listings} />
            <Route exact path="/listing/:location" component={Listing} />
            <Route exact path="/user/:id" component={User} />
            <Route exact path="/login" component={Login} />
            <Route component={NotFound} />
          </Switch>
        </Router>
      </Layout>
    </ApolloProvider>
  );
}

export default App;
