import { gql } from "@apollo/client";

export const QUERY_AUTH_URL = gql`
  query authUrl {
    authUrl
  }
`;
