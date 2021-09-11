import { IResolvers } from "apollo-server-express";
import { ObjectId } from "mongodb";
import { Booking, Context, Listing } from "../../../lib/types";
import { authorize } from "../../../utils";
import { ListingsArgs } from "./types";

export const listingResolvers: IResolvers = {
  Query: {
    listing: async (
      _,
      { id }: ListingsArgs,
      { db, req }: Context
    ): Promise<Listing | null> => {
      const listing = await db.listings.findOne({ _id: new ObjectId(id) });
      if (!listing) {
        throw new Error("No listing was found for that id");
      }
      const hostId = listing.host;
      const viewer = await authorize(db, req);

      if (viewer?._id === hostId) {
        listing.authorized = true;
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
