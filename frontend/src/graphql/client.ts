import { ApolloClient, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
  credentials: "include",
  // We need this if we want to support setting cookies coming from the server
  cache: new InMemoryCache({
    typePolicies: {},
  }),
  uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
});
