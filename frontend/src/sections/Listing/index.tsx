import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { QUERY_LISTING } from "../../graphql";
import {
  Listing as IListingData,
  ListingVariables as IListingVariables,
} from "../../graphql/queries/__generated__/Listing";
import { RouteComponentProps } from "react-router-dom";
import { Viewer } from "../../types";
import { Layout } from "antd";
import { PageSkeleton } from "../../components/PageSkeleton";
import { ErrorBanner } from "../../components";
import ListingDetails from "./Components/ListingDetails";
import ListingBookings from "./Components/ListingBookings";

const PAGE_LIMIT = 4;

type IProps = RouteComponentProps<{ id: string }> & {
  viewer: Viewer;
};

const { Content } = Layout;

export const Listing = ({ match, viewer }: IProps) => {
  const userId = match.params.id;
  const [bookingsPage, setBookingsPage] = useState(1);

  const {
    data: listingData,
    loading: listingLoading,
    error: listingError,
  } = useQuery<IListingData, IListingVariables>(QUERY_LISTING, {
    variables: { id: userId, page: bookingsPage, limit: PAGE_LIMIT },
  });

  if (listingError) {
    return (
      <Content className="listing">
        <ErrorBanner description="This listing may not exist or we've encountered an error. Please try again soon." />
        <PageSkeleton />
      </Content>
    );
  }

  if (listingLoading) {
    return (
      <Content className="listing">
        <PageSkeleton />
      </Content>
    );
  }

  const listing = listingData ? listingData.listing : null;
  const listingBookings = listing ? listing.bookings : null;

  return (
    <Layout.Content className="listing">
      {listing ? <ListingDetails listing={listing} /> : null}

      <ListingBookings
        listingBookings={listingBookings}
        limit={PAGE_LIMIT}
        page={bookingsPage}
        setPage={setBookingsPage}
      />
    </Layout.Content>
  );
};
