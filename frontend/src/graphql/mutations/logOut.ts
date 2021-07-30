import { gql } from "@apollo/client";

export const MUTATION_LOG_OUT = gql`
  mutation logOut {
    logOut {
      didRequest
    }
  }
`;
