import { gql } from "@apollo/client";

export const MUTATION_LOG_IN = gql`
  mutation logIn($code: String!) {
    logIn(input: { code: $code }) {
      id
      token
      avatar
      hasWallet
      didRequest
    }
  }
`;
