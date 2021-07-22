import { gql } from "@apollo/client";

export const QUERY_LISTINGS = gql`
  query listings {
    listings {
      id
      title
      image
      address
      price
      numOfGuests
      numOfBeds
      numOfBaths
      rating
    }
  }
`;
