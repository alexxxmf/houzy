import { gql } from "@apollo/client";

export const MUTATION_CREATE_BOOKING = gql`
  mutation createBooking($input: CreateBookingInput!) {
    createBooking(input: $input) {
      id
    }
  }
`;
