import { Booking, Listing } from "../../../lib/types";

export interface ListingArgs {
  id: string;
}

export interface ListingBookingsArgs {
  limit: number;
  page: number;
}

export interface ListingBookingsData {
  total: number;
  result: Booking[];
}

export interface ListingsArgs {
  filter: ListingsFilter;
  limit: number;
  page: number;
}

export interface ListingsData {
  total: number;
  result: Listing[];
}

export enum ListingsFilter {
  PRICE_ASC = "PRICE_ASC",
  PRICE_DESC = "PRICE_DESC",
}
