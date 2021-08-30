import { IResolvers } from "apollo-server-express";
import { Context, User } from "../../../lib/types";
import { authorize } from "../../../utils";

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
  },
};
