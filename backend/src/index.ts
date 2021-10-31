/* eslint-disable @typescript-eslint/no-var-requires */
require("dotenv").config();

import express, { Application } from "express";
import compression from "compression";
import cookieParser from "cookie-parser";
import { ApolloServer } from "apollo-server-express";
import { connectDatabase } from "./database";
import { resolvers, typeDefs } from "./graphql";

const mount = async (app: Application) => {
  const db = await connectDatabase();

  app.use(express.json({ limit: "5mb" }));
  app.use(cookieParser(process.env.SECRET));
  app.use(compression());

  app.use(express.static(`${__dirname}/client`));
  app.get("*", (_req, res) => res.sendFile(`${__dirname}/client/index.html`));

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => ({ db, req, res }),
  });
  server.applyMiddleware({
    app,
    path: "/api",
    cors: { origin: process.env.PUBLIC_URL, credentials: true },
  });

  app.listen(process.env.PORT);

  console.log(`[app]: http://localhost:${process.env.PORT}`);
};

mount(express());
