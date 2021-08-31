import { IResolvers } from "apollo-server-express";
import { Context, User } from "../../../lib/types";
import { authorize } from "../../../utils";
import { UserBookingsArgs, UserBookingsData } from "./types";

export const userResolvers: IResolvers = {
  Query: {
    user: async (
      _root: undefined,
      { id }: { id: string },
      { db, req }: Context
    ) => {
      try {
        const user = await db.users.findOne({ _id: id });

        if (!user) {
          throw new Error(`User can't be found`);
        }

        const viewer = await authorize(db, req);

        if (viewer && viewer._id === user._id) {
          user.authorized = true;
        }

        return user;
      } catch (e) {
        throw new Error(`Failed to query user: ${e}`);
      }
    },
  },
  User: {
    id: (user: User): string => user._id.toString(),
    hasWallet: (user: User): boolean => Boolean(user.walletId),
    income: (user: User): number | null => {
      return user.authorized ? user.income : null;
    },
    // listings: (user: User) => {},
    bookings: async (
      user: User,
      { limit, page }: UserBookingsArgs,
      { db }: Context
    ): Promise<UserBookingsData | null> => {
      try {
        if (!user.authorized) {
          return null;
        }

        const data: UserBookingsData = {
          total: 0,
          result: [],
        };

        const cursor = await db.bookings.find({
          _id: {
            $in: user.bookings,
          },
        });

        cursor.skip(page > 0 ? (page - 1) * limit : 0);
        cursor.limit(limit);

        data.total = await cursor.count();
        data.result = await cursor.toArray();

        return data;
      } catch (e) {
        throw new Error(`Failed to query user bookings: ${e}`);
      }
    },
  },
};
