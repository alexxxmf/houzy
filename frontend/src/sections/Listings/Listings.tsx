import React from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Alert, Avatar, Button, List, Spin } from "antd";

import { QUERY_LISTINGS, MUTATION_DELETE_LISTING } from "../../graphql";
import { listings as IListingsData } from "../../graphql/__generated__/listings";
import {
  DeleteListing as IDeleteListingData,
  DeleteListingVariables as IDeleteListingVariables,
} from "../../graphql/__generated__/DeleteListing";
import { ListingShimmer } from "./components/ListingShimmer";

export const Listings = () => {
  const { data, loading, error, refetch } =
    useQuery<IListingsData>(QUERY_LISTINGS);

  const [
    deleteListing,
    { loading: deleteListingLoading, error: deleteListingError },
  ] = useMutation<IDeleteListingData, IDeleteListingVariables>(
    MUTATION_DELETE_LISTING
  );

  const handleDeleteListing = async (id: string) => {
    await deleteListing({ variables: { id } });
    refetch();
  };

  const listings = data ? data.listings : null;

  const listingsList = listings ? (
    <List
      itemLayout="horizontal"
      dataSource={listings}
      renderItem={(listing) => (
        <List.Item
          actions={[
            <Button
              type="primary"
              onClick={() => handleDeleteListing(listing.id)}
            >
              Delete
            </Button>,
          ]}
        >
          <List.Item.Meta
            title={listing.title}
            description={listing.address}
            avatar={<Avatar src={listing.image} shape="square" size={48} />}
          />
        </List.Item>
      )}
    />
  ) : null;

  if (loading) {
    return (
      <div className="listings">
        <ListingShimmer title={`Listings`} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="listings">
        <ListingShimmer title={`Listings`} error />
      </div>
    );
  }

  const deleteListingErrorAlert = deleteListingError ? (
    <Alert
      type="error"
      message="Something went wrong :(. Please try again later."
      className="listings__alert"
    />
  ) : null;

  return (
    <div className="listings">
      {deleteListingErrorAlert}
      <Spin spinning={deleteListingLoading}>
        <h2>Listings:</h2>
        {listingsList}
      </Spin>
    </div>
  );
};
