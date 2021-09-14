import React from "react";
import { Listing_listing as IListing } from "../../../graphql/queries/__generated__/Listing";

interface IProps {
  listing: IListing;
}

const ListingDetails = ({ listing }: IProps) => {
  const { title, description, image, host, type, address, city, numOfGuests } =
    listing;

  return (
    <div className="listing-details">
      <div
        className="listing-details__image"
        style={{ backgroundImage: `url(${image})` }}
      />
    </div>
  );
};

export default ListingDetails;
