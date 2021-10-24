import { IResolvers } from "apollo-server-express";
import { Booking, Context, Listing } from "../../../lib/types";

export const bookingResolvers: IResolvers = {
  Mutation: {
    createBooking: () => {
      return "create booking";
    },
  },
  Booking: {
    id: (booking: Booking): string => {
      return booking._id.toString();
    },
    listing: async (
      booking: Booking,
      _,
      { db }: Context
    ): Promise<Listing | null> => {
      return await db.listings.findOne({
        _id: booking.listing,
      });
    },
  },
};
