import { MongoClient } from "mongodb";

import { Database, Listing, User, Booking } from "../lib/types";

const user = process.env.MONGO_INITDB_ROOT_USERNAME;
const password = process.env.MONGO_INITDB_ROOT_PASSWORD;
const cluster = process.env.DB_CLUSTER;
const mongoPort = process.env.MONGO_PORT;
const mongoHost = process.env.MONGO_HOST;

let url: string;

if (!!process.env.ATLAS && cluster) {
  url = `mongodb+srv://${user}:${password}@${cluster}.mongodb.net/main?retryWrites=true&w=majority`;
} else {
  url = `mongodb://${user}:${password}@${mongoHost}${
    mongoPort ? `:${mongoPort}` : ""
  }/?authSource=admin`;
}

export const connectDatabase = async (): Promise<Database> => {
  const client = await MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = client.db("main");

  return {
    listings: db.collection<Listing>("listings"),
    users: db.collection<User>("users"),
    bookings: db.collection<Booking>("bookings"),
  };
};
