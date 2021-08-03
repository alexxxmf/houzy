# HOUZY

### Description

This is a webapp done using React, Typescript and Apollo Client

### Important notes

For apollo to allow incoming requests from client when running locally, instead of applying cors middleware through app like most people do, we have to do it this way to make it work

```
  server.applyMiddleware({
    app,
    path: "/api",
    cors: { origin: process.env.PUBLIC_URL, credentials: true },
  });
```
