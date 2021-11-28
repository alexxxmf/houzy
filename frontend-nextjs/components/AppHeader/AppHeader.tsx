import React, { useEffect, useState } from "react";
import { Layout } from "antd";
// import { Viewer } from "../../types";
import { MenuItems } from "./components";
import logo from "../../public/assets/houzy.png";
// import { displayErrorMessage } from "../../utils";
import Search from "antd/lib/input/Search";
import Link from "next/link";

// interface Props {
//   viewer: Viewer;
//   setViewer: (viewer: Viewer) => void;
// }

const { Header } = Layout;

export const AppHeader = () => {
  return (
    <Header className="app-header">
      <div className="app-header__logo-search-section">
        <div className="app-header__logo">
          <Link href="/">
            <img src={logo.src} alt="App logo" />
          </Link>
        </div>
        <div className="app-header__search-input">
          {/* <Search
              onSearch={onSearch}
              enterButton
              value={search}
              onChange={(evt) => setSearch(evt.target.value)}
              data-testid="search-bar"
              placeholder="Search 'San Francisco'"
            /> */}
        </div>
      </div>

      <div className="app-header__menu-section">
        {/* <MenuItems viewer={viewer} setViewer={setViewer} /> */}
      </div>
    </Header>
  );
};
