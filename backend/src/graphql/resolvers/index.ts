import merge from "lodash.merge";
import { viewerResolvers } from "./Viewers";
import { userResolvers } from "./Users";

export const resolvers = merge(viewerResolvers, userResolvers);
