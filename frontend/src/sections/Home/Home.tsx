import React from "react";
import { Col, Layout, Row, Typography } from "antd";
import { RouteComponentProps, Link } from "react-router-dom";

import { HomeHero } from "./components/HomeHero";
import mapBackground from "./assets/map-background.jpg";
import { displayErrorMessage } from "../../utils";
import sfImg from "./assets/sf.jpg";
import cancunImg from "./assets/cancun.jpg";
import { useScrollToTop } from "../../hooks/useScrollToTop";
import { useQuery } from "@apollo/client";
import { QUERY_LISTINGS } from "../../graphql";
import {
  ListingsVariables,
  Listings as ListingsData,
} from "../../graphql/queries/__generated__/Listings";
import { ListingsFilter } from "../../graphql/globalTypes";
import { HomeListingsSkeleton } from "./components/HomeListingsSkeleton";
import { HomeListings } from "./components/HomeListings";

const { Content } = Layout;
const { Paragraph, Title } = Typography;

const PAGE_LIMIT = 4;
const PAGE_NUMBER = 1;

export const Home = ({ history }: RouteComponentProps) => {
  const { data, loading } = useQuery<ListingsData, ListingsVariables>(
    QUERY_LISTINGS,
    {
      variables: {
        filter: ListingsFilter.PRICE_DESC,
        page: PAGE_NUMBER,
        limit: PAGE_LIMIT,
      },
      fetchPolicy: "cache-and-network",
      // so when we add a new super expensive listing we can see it straightaway
      // with default policy aggresive caching will prevent this unless manually refreshing window
    }
  );

  const onSearch = (value: string) => {
    const trimmedValue = value.trim();
    if (trimmedValue) {
      history.push(`/listings/${trimmedValue}`);
    } else {
      displayErrorMessage("Please enter a valid search");
    }
  };

  useScrollToTop();

  const renderListingsSection = () => {
    if (loading) {
      return <HomeListingsSkeleton />;
    }

    if (data) {
      return (
        <HomeListings
          title="Premium Listings"
          listings={data.listings.result}
        />
      );
    }

    return null;
  };

  return (
    <Content
      className="home"
      style={{ backgroundImage: `url(${mapBackground})` }}
    >
      <HomeHero onSearch={onSearch} />

      <div className="home__cta-section">
        <Title level={2} className="home__cta-section-title">
          Your guide for all things rental
        </Title>
        <Paragraph>
          Helping you make the best decisions in renting your last minute
          locations.
        </Paragraph>
        <Link
          to="/listings/united%20states"
          className="ant-btn ant-btn-primary ant-btn-lg home__cta-section-button"
        >
          Popular listings in the United States
        </Link>
      </div>

      <div className="home__listings">
        <Title level={4} className="home__listings-title">
          Listings of any kind
        </Title>
        <Row gutter={12}>
          <Col xs={24} sm={12}>
            <Link to="/listings/san%20fransisco">
              <div className="home__listings-img-cover">
                <img
                  src={sfImg}
                  alt="San Fransisco"
                  className="home__listings-img"
                />
              </div>
            </Link>
          </Col>
          <Col xs={24} sm={12}>
            <Link to="/listings/cancún">
              <div className="home__listings-img-cover">
                <img
                  src={cancunImg}
                  alt="Cancún"
                  className="home__listings-img"
                />
              </div>
            </Link>
          </Col>
        </Row>
      </div>
    </Content>
  );
};
