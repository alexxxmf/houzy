import { gql } from "@apollo/client";

export const MUTATION_DISCONNECT_STRIPE = gql`
  mutation disconnectStripe {
    disconnectStripe {
      hasWallet
    }
  }
`;
