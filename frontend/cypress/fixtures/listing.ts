import { ListingType } from "../../src/graphql/globalTypes";
import { Listing as ListingData } from "../../src/graphql/queries/__generated__/Listing";

export const listing: ListingData = {
  listing: {
    id: "5d378db94e84753160e08b4c",
    title: "Beautiful 2 bedroom townhouse",
    image:
      "https://res.cloudinary.com/tiny-house/image/upload/v1560645408/mock/London/london-listing-5_jwyidl.jpg",
    address: "44  Greyfriars Ave, London, United Kingdom",
    price: 23483,
    numOfGuests: 4,
    host: {
      id: "1234",
      name: "Pepito",
      avatar:
        "https://lh3.googleusercontent.com/a-/AOh14GjZIFBQGChJSttvhydhZX8bMVW0NEVMx1USfsXbCQ=s100",
      hasWallet: true,
      __typename: "User",
    },
    type: ListingType.HOUSE,
    city: "Madrid",
    bookings: null,
    bookingsIndex: '{"2022":{"4":{}}}',
    __typename: "Listing",
    description: "Description here",
  },
};
