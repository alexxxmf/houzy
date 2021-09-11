import { IResolvers } from "apollo-server-express";
import { Booking, Context, Listing } from "../../../lib/types";

export const listingResolvers: IResolvers = {
  Query: {
    listing: () => "Query.listing",
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
