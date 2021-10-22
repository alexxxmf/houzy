import { IResolvers } from "apollo-server-express";
import { ObjectId } from "mongodb";
import { Google } from "../../../lib/api";
import {
  Booking,
  Context,
  Listing,
  ListingType,
  User,
} from "../../../lib/types";
import { authorize } from "../../../utils";
import {
  HostListingArgs,
  HostListingInput,
  ListingArgs,
  ListingBookingsArgs,
  ListingBookingsData,
  ListingsArgs,
  ListingsData,
  ListingsFilter,
  ListingsQuery,
} from "./types";

const verifyHostListingInput = ({
  title,
  description,
  price,
  type,
}: HostListingInput) => {
  if (title.length > 100) {
    throw new Error("listing title must be under 100 characters");
  }
  if (description.length > 5000) {
    throw new Error("listing description must be under 5000 characters");
  }
  if (type !== ListingType.House && type !== ListingType.Apartment) {
    throw new Error("listing type must be either an apartment or house");
  }
  if (price < 0) {
    throw new Error("price must be greater than 0");
  }
};

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
      { location, filter, page, limit }: ListingsArgs,
      { db }: Context
    ): Promise<ListingsData> => {
      const query: ListingsQuery = {};
      const data: ListingsData = {
        total: 0,
        result: [],
        region: null,
      };

      if (location) {
        const { country, admin, city } = await Google.geocode(location);

        if (city) query.city = city;
        if (admin) query.admin = admin;
        if (country) {
          query.country = country;
        } else {
          throw new Error("no country found");
        }

        const cityText = city ? `${city}, ` : "";
        const adminText = admin ? `${admin}, ` : "";
        const regionText = `${cityText}${adminText}${country}`;

        data.region = regionText;
      }

      const listingsCursor = db.listings.find(query);

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
  Mutation: {
    hostListing: async (
      _,
      { input }: HostListingArgs,
      { db, req }: Context
    ): Promise<Listing> => {
      verifyHostListingInput(input);

      let viewer = await authorize(db, req);
      if (!viewer) {
        throw new Error("viewer cannot be found");
      }

      const { country, admin, city } = await Google.geocode(input.address);

      if (!country || !admin || !city) {
        throw new Error("invalid address input");
      }

      const insertResult = await db.listings.insertOne({
        _id: new ObjectId(),
        ...input,
        bookings: [],
        bookingsIndex: {},
        country,
        admin,
        city,
        host: viewer._id,
      });

      const insertedListing: Listing = insertResult.ops[0];

      await db.users.updateOne(
        { _id: viewer._id },
        { $push: { listings: insertedListing._id } }
      );

      return insertedListing;
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
