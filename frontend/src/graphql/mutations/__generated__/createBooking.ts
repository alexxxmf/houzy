/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateBookingInput } from "./../../globalTypes";

// ====================================================
// GraphQL mutation operation: createBooking
// ====================================================

export interface createBooking_createBooking {
  __typename: "Booking";
  id: string;
}

export interface createBooking {
  createBooking: createBooking_createBooking;
}

export interface createBookingVariables {
  input: CreateBookingInput;
}
