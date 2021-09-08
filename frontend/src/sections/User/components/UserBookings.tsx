import { List, Typography } from "antd";
import React from "react";
import ListingCard from "../../../components/ListingCard";
import { User_user_bookings as IUserBookings } from "../../../graphql/queries/__generated__/User";

interface IProps {
  page: number;
  userBookings: IUserBookings;
  limit: number;
  setPage: (pageNumber: number) => void;
}

const UserBookings = ({ page, limit, userBookings, setPage }: IProps) => {
  const userBookingsList = (
    <List
      grid={{ gutter: 8, xs: 1, sm: 2, lg: 4 }}
      dataSource={userBookings.result}
      locale={{ emptyText: "You haven't made any bookings yet!" }}
      pagination={{
        position: "top",
        total: userBookings.total,
        current: page,
        defaultPageSize: limit,
        hideOnSinglePage: true,
        showLessItems: true,
        onChange: (page: number) => setPage(page),
      }}
      renderItem={(userBooking) => (
        <List.Item>
          <ListingCard listing={userBooking.listing} />
        </List.Item>
      )}
    />
  );
  return (
    <div className="user-bookings">
      <Typography.Title level={4} className="user-bookings__title">
        Listings
      </Typography.Title>
      <Typography.Paragraph>
        This section contains the bookings you've made so far
      </Typography.Paragraph>
      {userBookingsList}
    </div>
  );
};

export default UserBookings;
