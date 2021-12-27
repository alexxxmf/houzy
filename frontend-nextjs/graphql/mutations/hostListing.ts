import { gql } from "@apollo/client";

export const MUTATION_HOST_LISTING = gql`
  mutation HostListing($input: HostListingInput!) {
    hostListing(input: $input) {
      id
    }
  }
`;
