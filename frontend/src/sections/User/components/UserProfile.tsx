import React from "react";
import { Card, Avatar, Divider, Typography, Button } from "antd";

import { User_user as IUser } from "../../../graphql/queries/__generated__/User";

interface IProps {
  user: IUser;
  viewerIsUser: boolean;
}

const UserProfile = ({ user, viewerIsUser }: IProps) => {
  const AdditionalSection = viewerIsUser ? (
    <>
      <Divider />
      <div className="user-profile__details">
        <Typography.Title>Additional Details</Typography.Title>
        <Typography.Paragraph>
          Interested in becoming a Houzy host? Register with your Stripe
          account!
        </Typography.Paragraph>
        <Button type="primary" className="user-profile__details-cta">
          Connect with Stripe
        </Button>
        <Typography.Paragraph type="secondary">
          Houzy uses{" "}
          <a
            href="https://stripe.com/en-US/connect"
            target="_blank"
            rel="noopener noreferrer"
          >
            {`Stripe `}
          </a>
          to help transfer your earnings in a secure manner
        </Typography.Paragraph>
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
