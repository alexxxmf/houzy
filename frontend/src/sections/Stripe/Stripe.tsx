import React, { useEffect, useRef } from "react";
import { useMutation } from "@apollo/client";
import { Layout, Spin } from "antd";
import {
  connectStripe as ConnectStripeData,
  connectStripeVariables as ConnectStripeVariables,
} from "../../graphql/mutations/__generated__/connectStripe";
import { MUTATION_CONNECT_STRIPE } from "../../graphql";
import { Viewer } from "../../types";
import { Redirect, RouteComponentProps, useHistory } from "react-router-dom";
import { displaySuccessNotification } from "../../utils";
import { useScrollToTop } from "../../hooks/useScrollToTop";

interface Props {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
}

const { Content } = Layout;

export const Stripe = ({ viewer, setViewer }: Props & RouteComponentProps) => {
  const [connectStripe, { data, loading, error }] = useMutation<
    ConnectStripeData,
    ConnectStripeVariables
  >(MUTATION_CONNECT_STRIPE, {
    onCompleted: (data) => {
      if (data && data.connectStripe) {
        setViewer({ ...viewer, hasWallet: data.connectStripe.hasWallet });
        displaySuccessNotification(
          "You've successfully connected your Stripe Account!",
          "You can now begin to create listigns in the Host Page"
        );
      }
    },
  });

  const connectStripeRef = useRef(connectStripe);

  const history = useHistory();
  useScrollToTop();

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");

    if (code) {
      connectStripeRef.current({
        variables: {
          input: { code },
        },
      });
    } else {
      history.replace("/login");
    }
  }, [history]);

  if (data && data.connectStripe) {
    return <Redirect to={`/user/${viewer.id}`} />;
  }

  // if (loading) {
  //   return (
  //     <Content className="stripe">
  //       <Spin size="large" tip="Connecting your Stripe account..." />
  //     </Content>
  //   );
  // }

  // if (error) {
  //   return <Redirect to={`/user/${viewer.id}?stripe_error=true`} />;
  // }

  return null;
};
