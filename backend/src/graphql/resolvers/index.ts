import merge from "lodash.merge";
import { listingResolvers } from "./Listings";
import { viewerResolvers } from "./Viewers";

export const resolvers = merge(listingResolvers, viewerResolvers);
