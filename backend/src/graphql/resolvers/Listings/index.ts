import { IResolvers } from "apollo-server-express";
import { ObjectId } from "mongodb";
import { Booking, Context, Listing, User } from "../../../lib/types";
import { authorize } from "../../../utils";
import {
  ListingArgs,
  ListingBookingsArgs,
  ListingBookingsData,
  ListingsArgs,
  ListingsData,
  ListingsFilter,
} from "./types";

export const listingResolvers: IResolvers = {
  Query: {
    listing: async (
      _,
      { id }: ListingArgs,
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
    listings: async (
      _,
      { filter, page, limit }: ListingsArgs,
      { db }: Context
    ): Promise<ListingsData> => {
      const data: ListingsData = {
        total: 0,
        result: [],
      };

      const listingsCursor = db.listings.find({});

      listingsCursor.limit(limit);
      listingsCursor.skip(page > 0 ? (page - 1) * limit : 0);

      if (filter === ListingsFilter["PRICE_ASC"]) {
        listingsCursor.sort({
          price: 1,
        });
      }

      if (filter === ListingsFilter["PRICE_DESC"]) {
        listingsCursor.sort({
          price: -1,
        });
      }

      data.total = await listingsCursor.count();
      data.result = await listingsCursor.toArray();

      return data;
    },
  },

  Listing: {
    id: (listing: Listing): string => {
      return listing._id.toString();
    },
    host: async (
      listing: Listing,
      _,
      { db }: Context
    ): Promise<User | null> => {
      const hostId = listing.host;
      const hostData = await db.users.findOne({ _id: hostId });

      if (!hostData) {
        throw new Error("host can't be found");
      }

      return hostData;
    },
    bookingsIndex: (listing: Listing): string => {
      return JSON.stringify(listing.bookingsIndex);
    },
    bookings: async (
      listing: Listing,
      { limit, page }: ListingBookingsArgs,
      { db }: Context
    ): Promise<ListingBookingsData | null> => {
      if (!listing.authorized) {
        return null;
      }

      const bookingsData: ListingBookingsData = {
        total: 0,
        result: [],
      };

      const bookingsCursor = await db.bookings.find({
        _id: { $in: listing.bookings },
      });

      bookingsCursor.limit(limit);
      bookingsCursor.skip(page > 0 ? (page - 1) * limit : 0);

      bookingsData.total = await bookingsCursor.count();
      bookingsData.result = await bookingsCursor.toArray();

      return bookingsData;
    },
  },
};
