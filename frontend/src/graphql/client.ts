import {
  ApolloClient,
  from,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from "@apollo/client";

const httpLink = new HttpLink({ uri: process.env.REACT_APP_GRAPHQL_ENDPOINT });

const authMiddleware = new ApolloLink((operation, forward) => {
  const csrfToken = sessionStorage.getItem(
    process.env.REACT_CSRF_TOKEN_KEY || ""
  );

  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      "X-CSRF-TOKEN": csrfToken || "",
    },
  }));

  return forward(operation);
});

export const client = new ApolloClient({
  credentials: "include",
  // We need this if we want to support setting cookies coming from the server
  cache: new InMemoryCache({
    typePolicies: {},
  }),
  link: from([httpLink, authMiddleware]),
});
