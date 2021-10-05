import React from "react";

import { Card, Col, Row, Typography, Input } from "antd";

import torontoImg from "../../assets/toronto.jpg";
import sfImg from "../../assets/san-francisco.jpg";
import laImg from "../../assets/los-angeles.jpg";
import londonImg from "../../assets/london.jpg";
import dubaiImg from "../../assets/dubai.jpg";
import cancunImg from "../../assets/cancun.jpg";

const { Title } = Typography;
const { Search } = Input;

export const HomeHero = () => {
  return (
    <div className="home-hero">
      <div className="home-hero__search">
        <Title className="home-hero__title">
          Find a place you'll love to stay at
        </Title>
        <Search
          placeholder="Search 'San Francisco'"
          size="large"
          enterButton
          className="home-hero__search-input"
        />
      </div>
    </div>
  );
};
