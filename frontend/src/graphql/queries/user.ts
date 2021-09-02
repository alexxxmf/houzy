import { gql } from "@apollo/client";

export const QUERY_USER = gql`
  query User($id: ID!) {
    user(id: $id) {
      id
      name
      avatar
      contact
      hasWallet
      income
    }
  }
`;
