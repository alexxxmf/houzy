import { Listings as ListingsData } from "../../src/graphql/queries/__generated__/Listings";

export const listings: ListingsData = {
  listings: {
    region: null,
    total: 40,
    result: [
      {
        id: "5d378db94e84753160e08b53",
        title: "Spacious 2 story beach house",
        image:
          "https://res.cloudinary.com/tiny-house/image/upload/v1560646430/mock/Cancun/cancun-listing-1_zihihs.jpg",
        address: "100 Punta Nizuc Rd., Cancún, Mexico",
        price: 24842,
        numOfGuests: 4,
        __typename: "Listing",
      },
      {
        id: "5d378db94e84753160e08b37",
        title: "Chic downtown condo",
        image:
          "https://res.cloudinary.com/tiny-house/image/upload/v1560641352/mock/Toronto/toronto-listing-8_awkmrj.jpg",
        address: "20 Overlook St, Toronto, ON, CA",
        price: 23903,
        numOfGuests: 4,
        __typename: "Listing",
      },
      {
        id: "5d378db94e84753160e08b4c",
        title: "Beautiful 2 bedroom townhouse",
        image:
          "https://res.cloudinary.com/tiny-house/image/upload/v1560645408/mock/London/london-listing-5_jwyidl.jpg",
        address: "44  Greyfriars Ave, London, United Kingdom",
        price: 23483,
        numOfGuests: 4,
        __typename: "Listing",
      },
      {
        id: "5d378db94e84753160e08b54",
        title: "Beachfront suite",
        image:
          "https://res.cloudinary.com/tiny-house/image/upload/v1560646289/mock/Cancun/cancun-listing-2_bsocu5.jpg",
        address: "100 Punta Nizuc Rd., Cancún, Mexico",
        price: 23012,
        numOfGuests: 1,
        __typename: "Listing",
      },
    ],
    __typename: "Listings",
  },
};
