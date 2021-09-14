import Icon from "@ant-design/icons";
import { Avatar, Divider, Tag, Typography } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import { Listing_listing as IListing } from "../../../../graphql/queries/__generated__/Listing";

interface IProps {
  listing: IListing;
}

const ListingDetails = ({ listing }: IProps) => {
  const { title, description, image, host, type, address, city, numOfGuests } =
    listing;

  return (
    <div className="listing-details">
      <div
        className="listing-details__image"
        style={{ backgroundImage: `url(${image})` }}
      />

      <div className="listing-details__information">
        <Typography.Paragraph
          type="secondary"
          ellipsis
          className="listing-details__city-address"
        >
          <Link to={`/listings/${city}`}>
            <Icon type="environment" style={{ color: "#1890ff" }} />
            {city}
          </Link>
          <Divider type="vertical" />
          {address}
        </Typography.Paragraph>
        <Typography.Title level={3} className="listing-details__title">
          {title}
        </Typography.Title>
      </div>
      <Divider />

      <div className="listing-details__section">
        <Link to={`/user/${host.id}`}>
          <Avatar src={host.avatar} size={64} />
          <Typography.Title level={2} className="listing-details__host-name">
            {host.name}
          </Typography.Title>
        </Link>
      </div>

      <Divider />

      <div className="listing-details__section">
        <Typography.Title level={4}>About this space</Typography.Title>
        <div className="listing-details__about-items">
          <Tag color="magenta">{type}</Tag>
          <Tag color="magenta">{numOfGuests} Guests</Tag>
        </div>
        <Typography.Paragraph ellipsis={{ rows: 3, expandable: true }}>
          {description}
        </Typography.Paragraph>
      </div>
    </div>
  );
};

export default ListingDetails;
