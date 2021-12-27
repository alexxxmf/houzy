require("dotenv").config();

import { MongoClient } from "mongodb";

const user = process.env.MONGO_INITDB_ROOT_USERNAME;
const password = process.env.MONGO_INITDB_ROOT_PASSWORD;
const cluster = process.env.DB_CLUSTER;
const mongoPort = process.env.MONGO_PORT;
const mongoHost = process.env.MONGO_HOST;

const test = async () => {
  const url = `mongodb://${user}:${password}@${mongoHost}${
    mongoPort ? `:${mongoPort}` : ""
  }/?authSource=admin`;

  try {
    console.log("[test] : running...");

    console.log("url", url);

    const client = await MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const db = client.db("main");
  } catch (e) {
    console.log("e", e);
    throw new Error("failed to test the connection");
  }
};

test();
