import merge from "lodash.merge";
import { listingResolvers } from "./Listings";
import { viewerResolvers } from "./Viewers";
import { userResolvers } from "./Users";

export const resolvers = merge(
  listingResolvers,
  viewerResolvers,
  userResolvers
);
