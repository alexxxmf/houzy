import React from "react";
import { Avatar, Divider, List, Typography } from "antd";
import { Link } from "react-router-dom";
import {
  Listing_listing_bookings as IListingBooking,
  Listing_listing_bookings_result as listingBooking,
} from "../../../../graphql/queries/__generated__/Listing";
import { Viewer } from "../../../../types";

interface IProps {
  listingBookings: IListingBooking;
  page: number;
  limit: number;
  setPage: (pageNumber: number) => void;
  viewer: Viewer;
}

const ListingBookings = ({
  listingBookings,
  page,
  limit,
  setPage,
  viewer,
}: IProps) => {
  const total = listingBookings ? listingBookings.total : null;
  const result = listingBookings ? listingBookings.result : null;

  const listingBookingsList = listingBookings ? (
    <List
      grid={{
        gutter: 8,
        xs: 1,
        sm: 2,
        lg: 3,
      }}
      dataSource={result ? result : undefined}
      locale={{ emptyText: "No bookings have been made yet!" }}
      pagination={{
        current: page,
        total: total ? total : 0,
        defaultPageSize: limit,
        hideOnSinglePage: true,
        showLessItems: true,
        onChange: (pageNumber: number) => setPage(pageNumber),
      }}
      renderItem={(listingBooking: listingBooking) => {
        const { tenant, checkIn, checkOut } = listingBooking;

        const bookingHistory = (
          <div className="listing-bookings__history">
            <div>
              Check in: <Typography.Text strong>{checkIn}</Typography.Text>
            </div>
            <div>
              Check out: <Typography.Text strong>{checkOut}</Typography.Text>
            </div>
          </div>
        );

        return (
          <List.Item className="listing-bookings__item">
            {bookingHistory}
            <Link to={`/user/${tenant.id}`}>
              <Avatar src={tenant.avatar} size={64} shape="square" />
            </Link>
          </List.Item>
        );
      }}
    />
  ) : null;

  const listingBookingsElement = listingBookingsList ? (
    <div className="listing-bookings">
      <Divider />
      <div className="listing-bookings__section">
        <Typography.Title level={4}>Bookings</Typography.Title>
      </div>
      {listingBookingsList}
    </div>
  ) : null;

  return listingBookingsElement;
};

export default ListingBookings;
