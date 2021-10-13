import { gql } from "@apollo/client";

export const MUTATION_CONNECT_STRIPE = gql`
  mutation connectStripe($input: ConnectStripeInput!) {
    connectStripe(input: $input) {
      hasWallet
    }
  }
`;
