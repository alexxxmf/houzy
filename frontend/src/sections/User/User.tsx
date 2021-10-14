import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { RouteComponentProps } from "react-router-dom";

import { QUERY_USER } from "../../graphql";
import {
  UserVariables as IUserVariables,
  User as IUserData,
} from "../../graphql/queries/__generated__/User";
import { Viewer } from "../../types";
import { PageSkeleton } from "../../components/PageSkeleton";
import { ErrorBanner } from "../../components";
import { Col, Row, Layout } from "antd";
import UserProfile from "./components/UserProfile";
import UserListings from "./components/UserListings";
import UserBookings from "./components/UserBookings";

type IProps = RouteComponentProps<{ id: string }> & {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
};

const { Content } = Layout;

const PAGE_LIMIT = 4;

export const User = ({ viewer, match, setViewer }: IProps) => {
  const userId = match.params.id;
  const [bookingsPage, setBookingsPage] = useState(1);
  const [listingsPage, setListingsPage] = useState(1);

  const {
    data: userData,
    loading: userLoading,
    error: userError,
    refetch,
  } = useQuery<IUserData, IUserVariables>(QUERY_USER, {
    variables: { id: userId, bookingsPage, listingsPage, limit: PAGE_LIMIT },
  });

  const handleUserRefetch = async () => {
    await refetch();
  };

  if (userLoading) {
    return (
      <Content className="user">
        <PageSkeleton />
      </Content>
    );
  }

  const stripeError = new URL(window.location.href).searchParams.get(
    "stripe_error"
  );
  const stripeErrorBanner = stripeError ? (
    <ErrorBanner description="We had an issue connecting with Stripe. Please try again soon!" />
  ) : null;

  if (userError) {
    return (
      <Content className="user">
        <ErrorBanner description="This user may not exist or we've encountered an error. Please try again soon." />
        <PageSkeleton />
      </Content>
    );
  }

  const user = userData?.user ?? null;
  const viewerIsUser = viewer.id === userId;
  const userBookings = user?.bookings ?? null;
  const userListings = user?.listings ?? null;

  return (
    <Content className="user">
      {stripeErrorBanner}
      <Row gutter={12} justify="space-between">
        <Col xs={24}>
          {user ? (
            <UserProfile
              user={user}
              viewerIsUser={viewerIsUser}
              viewer={viewer}
              setViewer={setViewer}
              handleUserRefetch={handleUserRefetch}
            />
          ) : null}
        </Col>
        <Col xs={24}>
          {userListings ? (
            <UserListings
              page={listingsPage}
              limit={PAGE_LIMIT}
              userListings={userListings}
              setPage={setListingsPage}
            />
          ) : null}
          {userBookings ? (
            <UserBookings
              page={bookingsPage}
              limit={PAGE_LIMIT}
              userBookings={userBookings}
              setPage={setBookingsPage}
            />
          ) : null}
        </Col>
      </Row>
    </Content>
  );
};
