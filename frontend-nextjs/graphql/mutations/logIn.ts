import { gql } from "@apollo/client";

export const MUTATION_LOG_IN = gql`
  mutation logIn($input: LogInInput) {
    logIn(input: $input) {
      id
      token
      avatar
      hasWallet
      didRequest
    }
  }
`;
