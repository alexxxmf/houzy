import { IResolvers } from "apollo-server-express";
import { Booking, Context, Listing } from "../../../lib/types";

export const listingResolvers: IResolvers = {
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
