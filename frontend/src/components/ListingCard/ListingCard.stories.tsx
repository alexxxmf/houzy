import React from "react";
import { storiesOf } from "@storybook/react";
import ListingCard from "./index";
import img from "../../assets/test-listing.jpeg";

const listing = {
  id: "123456",
  title: "Fancy house",
  image: img,
  address: "Rodeo Drive 123, Los Angeles, California",
  price: 12000,
  numOfGuests: 4,
};

storiesOf("components/ListingCard", module).add("Standard", () => (
  <ListingCard listing={listing} />
));
