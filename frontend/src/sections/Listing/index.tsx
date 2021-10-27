import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { QUERY_LISTING } from "../../graphql";
import {
  Listing as IListingData,
  ListingVariables as IListingVariables,
} from "../../graphql/queries/__generated__/Listing";
import { RouteComponentProps } from "react-router-dom";
import { Dayjs } from "dayjs";
import { Viewer } from "../../types";
import { Col, Layout, Row } from "antd";
import { PageSkeleton } from "../../components/PageSkeleton";
import { ErrorBanner } from "../../components";
import ListingDetails from "./Components/ListingDetails";
import ListingBookings from "./Components/ListingBookings";
import ListingCreateBooking from "./Components/ListingCreateBooking";
import { ListingCreateBookingModal } from "./Components/ListingCreateBookingModal";

const PAGE_LIMIT = 4;

type IProps = RouteComponentProps<{ id: string }> & {
  viewer: Viewer;
};

const { Content } = Layout;

export const Listing = ({ match, viewer }: IProps) => {
  const userId = match.params.id;
  const [bookingsPage, setBookingsPage] = useState(1);
  const [checkInDate, setCheckInDate] = useState<Dayjs | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Dayjs | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

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

  const ListingCreateBookingModalElement =
    listing && checkInDate && checkOutDate ? (
      <ListingCreateBookingModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        price={listing?.price}
        checkInDate={checkInDate}
        checkOutDate={checkOutDate}
      />
    ) : null;

  return (
    <Layout.Content className="listing">
      <Row gutter={24} justify="space-between">
        <Col xs={24} lg={14}>
          {listing ? <ListingDetails listing={listing} /> : null}
          {listingBookings ? (
            <ListingBookings
              listingBookings={listingBookings}
              limit={PAGE_LIMIT}
              page={bookingsPage}
              setPage={setBookingsPage}
              viewer={viewer}
            />
          ) : null}
        </Col>
        <Col xs={24} lg={10}>
          {listing ? (
            <ListingCreateBooking
              price={listing.price}
              checkOutDate={checkOutDate}
              setCheckOutDate={setCheckOutDate}
              checkInDate={checkInDate}
              setCheckInDate={setCheckInDate}
              viewer={viewer}
              host={listing.host}
              bookingsIndex={listing.bookingsIndex}
              setModalVisible={setModalVisible}
            />
          ) : null}
        </Col>
      </Row>
      {ListingCreateBookingModalElement}
    </Layout.Content>
  );
};
