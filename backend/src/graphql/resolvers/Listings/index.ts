import { IResolvers } from "apollo-server-express";
import { ObjectId } from "mongodb";
import { Booking, Context, Listing } from "../../../lib/types";
import { ListingsArgs } from "./types";

export const listingResolvers: IResolvers = {
  Query: {
    listing: async (
      _,
      { id, page, limit }: ListingsArgs,
      { db, req }: Context
    ): Promise<Listing | null> => {
      const listing = await db.listings.findOne({ _id: new ObjectId(id) });
      if (!listing) {
        throw new Error("No listing was found for that id");
      }
      return listing;
    },
  },

  Listing: {
    id: (listing: Listing): string => {
      return listing._id.toString();
    },
    bookings: async (
      listing: Listing,
      _,
      { db }: Context
    ): Promise<Booking[] | null> => {
      return await db.bookings
        .find({ _id: { $in: listing.bookings } })
        .toArray();
    },
  },
};
