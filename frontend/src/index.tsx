import { ApolloProvider } from "@apollo/client";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { client } from "./graphql";
import "./styles/index.css";

// Important: there seems to be a problem created by the apollo cache object that messes up the types
ReactDOM.render(
  <React.StrictMode>
    {/* @ts-ignore */}
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
