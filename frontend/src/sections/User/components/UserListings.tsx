import { List, Typography } from "antd";
import React from "react";
import ListingCard from "../../../components/ListingCard";
import { User_user_listings as IUserListings } from "../../../authUrl/../graphql/queries/__generated__/User";

interface IProps {
  page: number;
  userListings: IUserListings;
  limit: number;
  setPage: (pageNumber: number) => void;
}

const UserListings = ({ page, limit, userListings, setPage }: IProps) => {
  const userListingsList = (
    <List
      grid={{ gutter: 8, xs: 1, sm: 2, lg: 4 }}
      dataSource={userListings.result}
      locale={{ emptyText: "User doesn't have any listings yet!" }}
      pagination={{
        position: "top",
        total: userListings.total,
        current: page,
        defaultPageSize: limit,
        hideOnSinglePage: true,
        showLessItems: true,
        onChange: (page: number) => setPage(page),
      }}
      renderItem={(userListing) => (
        <List.Item>
          <ListingCard listing={userListing} />
        </List.Item>
      )}
    />
  );
  return (
    <div className="user-listings">
      <Typography.Title level={4} className="user-listings__title">
        Listings
      </Typography.Title>
      <Typography.Paragraph>
        This section contains the listings this user currently hosts and has
        made available for bookings.
      </Typography.Paragraph>
      {userListingsList}
    </div>
  );
};

export default UserListings;
