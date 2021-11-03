import React, { useEffect, useState } from "react";
import { Link, withRouter, RouteComponentProps } from "react-router-dom";
import { Layout } from "antd";
import { Viewer } from "../../types";
import { MenuItems } from "./components";

import logo from "../../assets/houzy.png";
import { displayErrorMessage } from "../../utils";
import Search from "antd/lib/input/Search";

interface Props {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
}

const { Header } = Layout;

export const AppHeader = withRouter(
  ({ viewer, setViewer, history, location }: Props & RouteComponentProps) => {
    const [search, setSearch] = useState("");
    const onSearch = (value: string) => {
      const trimmedValue = value.trim();

      if (trimmedValue) {
        history.push(`/listings/${trimmedValue}`);
      } else {
        displayErrorMessage("Please enter a valid search!");
      }
    };

    useEffect(() => {
      const { pathname } = location;
      const pathnameSubStrings = pathname.split("/");

      if (!pathname.includes("/listings")) {
        setSearch("");
        return;
      }

      if (pathname.includes("/listings") && pathnameSubStrings.length === 3) {
        setSearch(pathnameSubStrings[2]);
        return;
      }
    }, [location]);

    return (
      <Header className="app-header">
        <div className="app-header__logo-search-section">
          <div className="app-header__logo">
            <Link to="/">
              <img src={logo} alt="App logo" />
            </Link>
          </div>
          <div className="app-header__search-input">
            <Search
              onSearch={onSearch}
              enterButton
              value={search}
              onChange={(evt) => setSearch(evt.target.value)}
              data-testid="search-bar"
              placeholder="Search 'San Francisco'"
            />
          </div>
        </div>

        <div className="app-header__menu-section">
          <MenuItems viewer={viewer} setViewer={setViewer} />
        </div>
      </Header>
    );
  }
);
