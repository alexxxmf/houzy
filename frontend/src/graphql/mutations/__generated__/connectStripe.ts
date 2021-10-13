/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ConnectStripeInput } from "./../../globalTypes";

// ====================================================
// GraphQL mutation operation: connectStripe
// ====================================================

export interface connectStripe_connectStripe {
  __typename: "Viewer";
  hasWallet: boolean | null;
}

export interface connectStripe {
  connectStripe: connectStripe_connectStripe;
}

export interface connectStripeVariables {
  input: ConnectStripeInput;
}
