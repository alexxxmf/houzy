import type { NextPage } from "next";
import { Col, Layout, Row, Typography } from "antd";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Link from "next/link";

const { Content } = Layout;
const { Text, Paragraph, Title } = Typography;

const Home: NextPage = () => {
  return (
    <Content
      className="home"
      // style={{ backgroundImage: `url(${mapBackground})` }}
    >
      {/* <HomeHero onSearch={onSearch} /> */}

      <div className="home__cta-section">
        <Title level={2} className="home__cta-section-title">
          Your guide for all things rental
        </Title>
        <Paragraph>
          Helping you make the best decisions in renting your last minute
          locations.
        </Paragraph>
        <Link
          href={{
            pathname: "/listings/united%20states",
          }}
          className="ant-btn ant-btn-primary ant-btn-lg home__cta-section-button"
        >
          Popular listings in the United States
        </Link>
      </div>

      {/* {renderListingsSection()} */}

      <div className="home__listings">
        <Title level={4} className="home__listings-title">
          Listings of any kind
        </Title>
        <Row gutter={12}>
          <Col xs={24} sm={12}>
            {/* <Link to="/listings/san%20fransisco">
              <div className="home__listings-img-cover">
                <img
                  src={sfImg}
                  alt="San Fransisco"
                  className="home__listings-img"
                />
              </div>
            </Link> */}
          </Col>
          <Col xs={24} sm={12}>
            {/* <Link to="/listings/cancún">
              <div className="home__listings-img-cover">
                <img
                  src={cancunImg}
                  alt="Cancún"
                  className="home__listings-img"
                />
              </div>
            </Link> */}
          </Col>
        </Row>
      </div>
    </Content>
  );
};

export default Home;
