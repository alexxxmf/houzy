import { gql } from "@apollo/client";

export const MUTATION_LOG_OUT = gql`
  mutation LogOut {
    logOut {
      didRequest
    }
  }
`;
