import React from "react";
import { Card, Avatar, Divider, Typography } from "antd";

import { User_user as IUser } from "../../../graphql/queries/__generated__/User";

interface IProps {
  user: IUser;
}

const UserProfile = ({ user }: IProps) => {
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
        </div>
      </Card>
    </div>
  );
};

export default UserProfile;
