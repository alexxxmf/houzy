import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "@apollo/client";
import { Affix, Layout, List, Typography } from "antd";
import { Link, RouteComponentProps } from "react-router-dom";
import {
  Listings as ListingsData,
  ListingsVariables,
} from "../../graphql/queries/__generated__/Listings";
import { QUERY_LISTINGS } from "../../graphql/queries/listings";
import { ListingsFilter } from "../../graphql/globalTypes";
import ListingCard from "../../components/ListingCard";
import { ListingsFilters, ListingsSkeleton } from "./components";
import { ListingsPagination } from "./components/ListingsPagination";
import { ErrorBanner } from "../../components";

const { Content } = Layout;

const { Title, Paragraph, Text } = Typography;

const PAGE_LIMIT = 4;

interface MatchParams {
  location: string;
}

export const Listings = ({ match }: RouteComponentProps<MatchParams>) => {
  const locationRef = useRef(match.params.location);
  const [filter, setFilter] = useState(ListingsFilter.PRICE_ASC);
  const [page, setPage] = useState(1);
  const { data, loading, error } = useQuery<ListingsData, ListingsVariables>(
    QUERY_LISTINGS,
    {
      skip: locationRef.current !== match.params.location && page !== 1,
      variables: {
        location: match.params.location,
        filter,
        limit: PAGE_LIMIT,
        page,
      },
    }
  );

  useEffect(() => {
    setPage(1);
    locationRef.current = match.params.location;
  }, [match.params.location]);

  const listings = data ? data.listings : null;
  const listingsRegion = listings ? listings.region : null;

  if (loading) {
    return (
      <Content className="listings" data-testid="listings-skeleton">
        <ListingsSkeleton />
      </Content>
    );
  }

  if (error) {
    return (
      <Content className="listings">
        <ErrorBanner description="We either couldn't find anything matching your search or have encountered an error. If you're searching for a unique location, try searching again with more common keywords." />
        <ListingsSkeleton />
      </Content>
    );
  }

  const listingsSectionElement =
    listings && listings.result.length ? (
      <div>
        <Affix offsetTop={64}>
          <ListingsPagination
            total={listings.total}
            page={page}
            limit={PAGE_LIMIT}
            setPage={setPage}
          />
          <ListingsFilters filter={filter} setFilter={setFilter} />
        </Affix>
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

  const listingsRegionElement = listingsRegion ? (
    <Title level={3} className="listings__title">
      Results for "{listingsRegion}"
    </Title>
  ) : null;

  return (
    <Content className="listings" data-testid="listings">
      {listingsRegionElement}
      {listingsSectionElement}
    </Content>
  );
};
