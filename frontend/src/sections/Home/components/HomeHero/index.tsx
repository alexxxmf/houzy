import React from "react";
import { Link } from "react-router-dom";

import { Card, Col, Row, Typography, Input } from "antd";

import torontoImg from "../../assets/toronto.jpg";
import laImg from "../../assets/los-angeles.jpg";
import londonImg from "../../assets/london.jpg";
import dubaiImg from "../../assets/dubai.jpg";

const { Title } = Typography;
const { Search } = Input;

interface IProps {
  onSearch: (value: string) => void;
}

export const HomeHero = ({ onSearch }: IProps) => {
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
          onSearch={onSearch}
        />
      </div>

      <Row gutter={12} className="home-hero__cards">
        <Col xs={12} md={6}>
          <Link to="/listings/toronto">
            <Card cover={<img src={torontoImg} />}>Toronto</Card>
          </Link>
        </Col>
        <Col xs={12} md={6}>
          <Link to="/listings/london">
            <Card cover={<img src={londonImg} />}>London</Card>
          </Link>
        </Col>
        <Col xs={12} md={6}>
          <Link to="/listings/dubai">
            <Card cover={<img src={dubaiImg} />}>Dubai</Card>
          </Link>
        </Col>
        <Col xs={12} md={6}>
          <Link to="/listings/los%20angeles">
            <Card cover={<img src={laImg} />}>Los Angeles</Card>
          </Link>
        </Col>
      </Row>
    </div>
  );
};
