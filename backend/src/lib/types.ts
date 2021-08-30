import { Collection, ObjectId as IObjectId, ObjectID } from "mongodb";
import { Response, Request } from "express";

export enum ListingType {
  Apartment = "APARTMENT",
  House = "HOUSE",
}

export interface Viewer {
  _id?: string;
  token?: string;
  avatar?: string;
  walletId?: string;
  didRequest: boolean;
}

export interface BookingsIndexMonth {
  [key: string]: boolean;
}

export interface BookingsIndexYear {
  [key: string]: BookingsIndexMonth;
}

export interface BookingsIndex {
  [key: string]: BookingsIndexYear;
}

export interface Listing {
  _id: ObjectID;
  title: string;
  description: string;
  image: string;
  host: string;
  type: ListingType;
  address: string;
  country: string;
  city: string;
  admin: string;
  bookings: IObjectId[];
  bookingsIndex: BookingsIndex;
  price: number;
  numOfGuests: number;
}

export interface UserArgs {
  id: string;
}

export interface User {
  _id: string;
  token: string;
  name: string;
  avatar: string;
  contact: string;
  walletId?: string;
  income: number;
  bookings: IObjectId[];
  listings: IObjectId[];
  authorized?: boolean;
}

export interface Booking {
  _id: ObjectID;
  listing: IObjectId;
  tenant: string;
  checkIn: string;
  checkOut: string;
}

export interface Database {
  listings: Collection<Listing>;
  users: Collection<User>;
  bookings: Collection<Booking>;
}

export interface Context {
  db: Database;
  res: Response;
  req: Request;
}
