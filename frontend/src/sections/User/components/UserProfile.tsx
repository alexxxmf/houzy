import React from "react";
import { Card, Avatar, Divider, Typography, Button, Tag } from "antd";

import { User_user as IUser } from "../../../graphql/queries/__generated__/User";
import {
  displayErrorMessage,
  displaySuccessNotification,
  priceFormatter,
} from "../../../utils";
import { MUTATION_DISCONNECT_STRIPE } from "../../../graphql";
import { useMutation } from "@apollo/client";
import { disconnectStripe as DisconnectStripeData } from "../../../graphql/mutations/__generated__/disconnectStripe";
import { Viewer } from "../../../types";

interface IProps {
  user: IUser;
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
  viewerIsUser: boolean;
  handleUserRefetch: () => void;
}

const stripeOauthUrl = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${process.env.REACT_APP_STRIPE_CLIENT_ID}&scope=read_write`;

const UserProfile = ({
  user,
  viewerIsUser,
  viewer,
  setViewer,
  handleUserRefetch,
}: IProps) => {
  const [disconnectStripe, { loading }] = useMutation<DisconnectStripeData>(
    MUTATION_DISCONNECT_STRIPE,
    {
      onCompleted: (data) => {
        if (data && data.disconnectStripe) {
          setViewer({ ...viewer, hasWallet: data.disconnectStripe.hasWallet });
          displaySuccessNotification(
            "You've successfully disconnected from Stripe",
            "You have to reconnect to Stripe to continue to create listings"
          );
          handleUserRefetch();
        }
      },
      onError: () => {
        displayErrorMessage(
          "Sorry! You weren't able to disconnect you from Stripe. Please try again later!"
        );
      },
    }
  );

  const redirectToStripe = () => {
    window.location.href = stripeOauthUrl;
  };

  const additionalDetails = user.hasWallet ? (
    <>
      <Typography.Paragraph>
        <Tag color="green">Stripe Registered</Tag>
      </Typography.Paragraph>
      <Typography.Paragraph>
        Income Earned:{" "}
        <Typography.Text strong>
          {user.income ? priceFormatter(user.income) : `$0`}
        </Typography.Text>
      </Typography.Paragraph>
      <Button
        type="primary"
        className="user-profile__details-cta"
        onClick={() => disconnectStripe()}
        loading={loading}
      >
        Disconnect Stripe
      </Button>
      <Typography.Paragraph type="secondary">
        By disconnecting, you won't be able to receive{" "}
        <Typography.Text strong>any further payments</Typography.Text>. This
        will prevent users from booking listings that you might have already
        created.
      </Typography.Paragraph>
    </>
  ) : (
    <>
      <Typography.Paragraph>
        Interested in becoming a Houzy host? Register with your Stripe account!
      </Typography.Paragraph>
      <Button
        type="primary"
        className="user-profile__details-cta"
        onClick={redirectToStripe}
      >
        Connect with Stripe
      </Button>
      <Typography.Paragraph type="secondary">
        Houzy uses
        <a
          href="https://stripe.com/en-US/connect"
          target="_blank"
          rel="noopener noreferrer"
        >
          {`Stripe `}
        </a>
        to help transfer your earnings in a secure manner
      </Typography.Paragraph>
    </>
  );

  const AdditionalSection = viewerIsUser ? (
    <>
      <Divider />
      <div className="user-profile__details">
        <Typography.Title>Additional Details</Typography.Title>
        {additionalDetails}
      </div>
    </>
  ) : null;

  return (
    <div className="user-profile">
      <Card className="user-profile__card">
        <div className="user-profile__avatar">
          <Avatar size={100} src={user.avatar} />
        </div>
        <Divider />
        <div className="user_profile__details">
          <Typography.Title level={4}>Details</Typography.Title>
          <Typography.Paragraph>
            Name: <Typography.Text>{user.name}</Typography.Text>
          </Typography.Paragraph>
          <Typography.Paragraph>
            Contact: <Typography.Text>{user.contact}</Typography.Text>
          </Typography.Paragraph>
        </div>
        {AdditionalSection}
      </Card>
    </div>
  );
};

export default UserProfile;
