import React from "react";
import { useQuery } from "@apollo/client";
import { RouteComponentProps } from "react-router-dom";
import { Content } from "antd/lib/layout/layout";

import { QUERY_USER } from "../../graphql";
import {
  UserVariables as IUserVariables,
  User_user as IUserData,
} from "../../graphql/queries/__generated__/User";
import { Viewer } from "../../types";
import { PageSkeleton } from "../../components/PageSkeleton";
import { ErrorBanner } from "../../components";

type IProps = RouteComponentProps<{ id: string }> & {
  viewer: Viewer;
};

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

  return <h2>User</h2>;
};
