import Icon from "@ant-design/icons";
import { Avatar, Divider, Tag, Typography } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import { Listing_listing_bookings as IListingBooking } from "../../../../graphql/queries/__generated__/Listing";

interface IProps {
  listingBookings: IListingBooking;
  page: number;
  limit: number;
  setPage: (pageNumber: number) => void;
}

const ListingBookings = ({ listingBookings, page, limit, setPage }: IProps) => {
  const total = listingBookings ? listingBookings.total : null;
  const result = listingBookings ? listingBookings.result : null;

  return <div className="listing-bookings"></div>;
};

export default ListingBookings;
