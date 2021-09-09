import merge from "lodash.merge";
import { viewerResolvers } from "./Viewers";
import { userResolvers } from "./Users";
import { listingResolvers } from "./Listings";
import { bookingResolvers } from "./Bookings";

export const resolvers = merge(
  viewerResolvers,
  userResolvers,
  listingResolvers,
  bookingResolvers
);
