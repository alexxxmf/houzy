import Icon from "@ant-design/icons";
import { Card, Typography } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import { priceFormatter } from "../../utils";

interface IProps {
  listing: {
    id: string;
    title: string;
    image: string;
    address: string;
    price: number;
    numOfGuests: number;
  };
}

const { Text, Title } = Typography;

const ListingCard = ({ listing }: IProps) => {
  const { title, image, address, price, numOfGuests, id } = listing;

  return (
    <Link to={`/listing/${id}`}>
      <Card
        hoverable
        cover={
          <div
            className="listing-card__cover-img"
            style={{ backgroundImage: `url(${image})` }}
          />
        }
      >
        <div className="listing-card__details">
          <div className="listing-card__description">
            <Title level={4} className="listing-card__price">
              {priceFormatter(price)}
              <span>/day</span>
            </Title>
            <Text strong ellipsis className="listing-card__title">
              {title}
            </Text>
            <Text ellipsis className="listing-card__address">
              {address}
            </Text>
          </div>
          <div className="listing-card__dimensions listing-card__dimensions--guests">
            <Icon type="user" style={{ color: "#1890ff" }} />
            <Text>{numOfGuests} guests</Text>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default ListingCard;
