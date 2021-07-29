import React from "react";
import { ApolloProvider } from "@apollo/client";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { client } from "./graphql";
import { Home, NotFound, Listing, Listings, User, Host } from "./sections";

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <Router>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/host" component={Host} />
            <Route exact path="/listings/:location?" component={Listings} />
            <Route exact path="/listing/:location" component={Listing} />
            <Route exact path="/user/:id" component={User} />
            <Route component={NotFound} />
          </Switch>
        </Router>
      </div>
    </ApolloProvider>
  );
}

export default App;
