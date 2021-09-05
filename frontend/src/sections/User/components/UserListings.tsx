import { List, Typography } from "antd";
import React from "react";
import ListingCard from "../../../components/ListingCard";

interface IProps {}

const UserListings = () => {
  // const userListingsList = (
  //   <List
  //     grid={{ gutter: 8, xs: 1, sm: 2, lg: 4 }}
  //     dataSource={[]}
  //     locale={{ emptyText: "User doesn't have any listings yet!" }}
  //     pagination={{
  //       position: "top",
  //     }}
  //     renderItem={(userListing) => (<ListingCard />)}
  //   />
  // );
  return (
    <div className="user-listings">
      <Typography.Title level={4} className="user-listings__title">
        Listings
      </Typography.Title>
      <Typography.Paragraph></Typography.Paragraph>
    </div>
  );
};

export default UserListings;
