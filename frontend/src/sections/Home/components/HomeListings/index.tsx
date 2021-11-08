import React from "react";
import { List, Typography } from "antd";

import ListingCard from "../../../../components/ListingCard";
import { Listings as ListingsData } from "../../../../graphql/queries/__generated__/Listings";

interface Props {
  title: string;
  listings: ListingsData["listings"]["result"];
}

const { Title } = Typography;

export const HomeListings = ({ title, listings }: Props) => {
  return (
    <div className="home-listings" data-testid="home-listings">
      <Title level={4} className="home-listings__title">
        {title}
      </Title>
      <List
        grid={{
          gutter: 8,
          xs: 1,
          sm: 2,
          lg: 4,
        }}
        dataSource={listings}
        renderItem={(listing) => (
          <List.Item>
            <ListingCard listing={listing} />
          </List.Item>
        )}
      />
    </div>
  );
};
