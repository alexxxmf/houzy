import { List, Typography } from "antd";
import React from "react";
import ListingCard from "../../../components/ListingCard";
import { User_user_bookings as IUserBookings } from "../../../graphql/queries/__generated__/User";

interface IProps {
  page: number;
  userBookings?: IUserBookings;
  limit: number;
  setPage: (pageNumber: number) => void;
}

const UserBookings = ({ page, limit, userBookings, setPage }: IProps) => {
  const userBookingsList = userBookings && (
    <List
      grid={{ gutter: 8, xs: 1, sm: 2, lg: 4 }}
      dataSource={userBookings.result ?? undefined}
      locale={{ emptyText: "You haven't made any bookings yet!" }}
      pagination={{
        position: "top",
        total: userBookings.total ?? undefined,
        current: page,
        defaultPageSize: limit,
        hideOnSinglePage: true,
        showLessItems: true,
        onChange: (page: number) => setPage(page),
      }}
      renderItem={(userBooking) => (
        <List.Item>
          <div className="user-bookings__booking-history">
            <div>
              Check in:
              <Typography.Text strong>{userBooking.checkIn}</Typography.Text>
            </div>
            <div>
              Check out:
              <Typography.Text strong>{userBooking.checkOut}</Typography.Text>
            </div>
          </div>
          <ListingCard listing={userBooking.listing} />
        </List.Item>
      )}
    />
  );
  return (
    <div className="user-bookings">
      <Typography.Title level={4} className="user-bookings__title">
        Bookings
      </Typography.Title>
      <Typography.Paragraph>
        This section contains the bookings you've made so far
      </Typography.Paragraph>
      {userBookingsList}
    </div>
  );
};

export default UserBookings;
