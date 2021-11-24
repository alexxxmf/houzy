import { User as UserData } from "../../src/graphql/queries/__generated__/User";

export const userWithoutStripeConn: UserData = {
  user: {
    id: "110304735686084337427",
    name: "Albert Einstein",
    avatar: "image",
    contact: "test@test.com",
    hasWallet: false,
    income: null,
    bookings: null,
    listings: {
      total: 0,
      result: [],
      __typename: "Listings",
    },
    __typename: "User",
  },
};
