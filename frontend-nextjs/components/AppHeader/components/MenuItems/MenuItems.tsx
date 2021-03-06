import React from "react";
import { Link, useHistory } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { Avatar, Button, Menu } from "antd";
import Icon from "@ant-design/icons";
import { MUTATION_LOG_OUT } from "../../../../graphql/mutations";
import { logOut as ILogOutData } from "../../../../graphql/mutations/__generated__/logOut";
import {
  displaySuccessNotification,
  displayErrorMessage,
} from "../../../../utils";
import { Viewer } from "../../../../types";

interface IProps {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
}

const { Item, SubMenu } = Menu;

export const MenuItems = ({ viewer, setViewer }: IProps) => {
  const history = useHistory();
  const [logOut] = useMutation<ILogOutData>(MUTATION_LOG_OUT, {
    onCompleted: (data) => {
      if (data && data.logOut) {
        // @ts-ignore
        setViewer(data.logOut);
        sessionStorage.removeItem("token");
        displaySuccessNotification("You've successfully logged out!");
        history.push("/login");
      }
    },
    onError: () => {
      displayErrorMessage(
        "Sorry! We weren't able to log you out. Please try again later!"
      );
    },
  });

  const handleLogOut = () => {
    logOut();
  };

  const subMenuLogin =
    viewer.id && viewer.avatar ? (
      <SubMenu key="user-menu" title={<Avatar src={viewer.avatar} />}>
        <Item key="/user">
          <Link to={`/user/${viewer.id}`}>
            <Icon viewBox="0 0 1024 1024" type="user" />
            Profile
          </Link>
        </Item>
        <Item key="/logout">
          <div onClick={handleLogOut}>
            <Icon viewBox="0 0 1024 1024" type="logout" />
            Log out
          </div>
        </Item>
      </SubMenu>
    ) : (
      <Item>
        <Link to="/login">
          <Button type="primary">Sign In</Button>
        </Link>
      </Item>
    );

  return (
    <Menu mode="horizontal" selectable={false} className="menu">
      <Item key="/host">
        <Link to="/host">
          <Icon type="home" />
          Host
        </Link>
      </Item>
      {subMenuLogin}
    </Menu>
  );
};
