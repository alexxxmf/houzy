import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { QUERY_LISTING } from "../../graphql";
import {
  Listing as IListingData,
  ListingVariables as IListingVariables,
} from "../../graphql/queries/__generated__/Listing";
import { RouteComponentProps } from "react-router-dom";
import { Viewer } from "../../types";

const PAGE_LIMIT = 4;

type IProps = RouteComponentProps<{ id: string }> & {
  viewer: Viewer;
};

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
  return <h2>Listing</h2>;
};
