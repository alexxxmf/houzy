import { IResolvers } from "apollo-server-express";
import { ObjectId } from "mongodb";
import { Context, Listing } from "../lib/types";

export const resolvers: IResolvers = {
  Query: {
    listings: async (
      _root: undefined,
      _args: unknown,
      { db }: Context
    ): Promise<Listing[]> => {
      return await db.listings.find().toArray();
    },
  },
  Mutation: {
    deleteListing: async (
      _root: undefined,
      { id }: { id: string },
      { db }: Context
    ): Promise<Listing> => {
      const deleteResponse = await db.listings.findOneAndDelete({
        _id: new ObjectId(id),
      });
      if (!deleteResponse.value) {
        throw new Error("failed to delete listing");
      }

      return deleteResponse.value;
    },
  },
  // Trivial resolvers
  // title: (listing: Listing) => listing.title
  // by default does this for fields in the response with the same name
  // in mongo id is recorded as _id, hence we need to explicitly set a trivial
  // revolser for this field
  Listing: {
    id: (listing: Listing): string => listing._id.toString(),
  },
};
