import React from "react";
import { ApolloProvider } from "@apollo/client";

import { client } from "./graphql";
import { Listings } from "./sections/Listings";

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <Listings />
      </div>
    </ApolloProvider>
  );
}

export default App;
