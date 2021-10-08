import React from "react";
import { useQuery } from "@apollo/client";
import { Layout, List, Typography } from "antd";
import { Link, RouteComponentProps } from "react-router-dom";
import {
  Listings as ListingsData,
  ListingsVariables,
} from "../../graphql/queries/__generated__/Listings";
import { QUERY_LISTINGS } from "../../graphql/queries/listings";
import { ListingsFilter } from "../../graphql/globalTypes";
import ListingCard from "../../components/ListingCard";

const { Content } = Layout;

const { Title, Paragraph, Text } = Typography;

const PAGE_LIMIT = 8;

interface MatchParams {
  location: string;
}

export const Listings = ({ match }: RouteComponentProps<MatchParams>) => {
  const { data } = useQuery<ListingsData, ListingsVariables>(QUERY_LISTINGS, {
    variables: {
      location: match.params.location,
      filter: ListingsFilter.PRICE_ASC,
      limit: PAGE_LIMIT,
      page: 1,
    },
  });

  const listings = data ? data.listings : null;
  const listingsRegion = listings ? listings.region : null;

  const listingSectionElement =
    listings && listings.result.length ? (
      <div>
        <List
          grid={{
            gutter: 8,
            xs: 1,
            sm: 2,
            lg: 4,
          }}
          dataSource={listings.result}
          renderItem={(listing) => (
            <List.Item>
              <ListingCard listing={listing} />
            </List.Item>
          )}
        />
      </div>
    ) : null;

  const listingsRegionElement = listingsRegion ? (
    <Title level={3} className="listings__title">
      Results for "{listingsRegion}"
    </Title>
  ) : (
    <div>
      <Paragraph>
        It appears that no listings have yet been created for{" "}
        <Text mark>"{listingsRegion}"</Text>
      </Paragraph>
      <Paragraph>
        Be the first person to create a{" "}
        <Link to="/host">listing in this area</Link>!
      </Paragraph>
    </div>
  );

  return (
    <Content className="listings">
      {listingsRegionElement}
      {listingSectionElement}
    </Content>
  );
};
