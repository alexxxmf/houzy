import React from "react";
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

type IProps = RouteComponentProps<{ id: string }> & {
  viewer: Viewer;
};

const { Content } = Layout;

export const User = ({ viewer, match }: IProps) => {
  const userId = match.params.id;

  const {
    data: userData,
    loading: userLoading,
    error: userError,
  } = useQuery<IUserData, IUserVariables>(QUERY_USER, {
    variables: { id: userId },
  });

  if (userLoading) {
    return (
      <Content className="user">
        <PageSkeleton />
      </Content>
    );
  }

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

  return (
    <Content className="user">
      <Row gutter={12} justify="space-between">
        <Col xs={24}>
          {user ? (
            <UserProfile user={user} viewerIsUser={viewerIsUser} />
          ) : null}
        </Col>
      </Row>
    </Content>
  );
};
