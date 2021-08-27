import {
  ApolloClient,
  concat,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from "@apollo/client";

// IMPORTANT NOTE
// new ApolloClient({credentials: "include", ...}
// to be able to set cookies on the client we need to declare credentials prop
// at the httpLink level, not the client level if we want it to work
const httpLink = new HttpLink({
  uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
  credentials: "include",
});

const authMiddleware = new ApolloLink((operation, forward) => {
  const csrfToken = sessionStorage.getItem(
    process.env.REACT_APP_CSRF_TOKEN_KEY || ""
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
  cache: new InMemoryCache({
    typePolicies: {},
  }),
  link: concat(authMiddleware, httpLink),
});
