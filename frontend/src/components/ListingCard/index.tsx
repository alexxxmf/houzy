import Icon from "@ant-design/icons";
import { Card, Typography } from "antd";
import React from "react";

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
  const { title, image, address, price, numOfGuests } = listing;
  console.log("check|image", image);
  return (
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
            {price}
            <span>/day</span>
          </Title>
          <Text strong ellipsis className="listing-card__title">
            {title}
          </Text>
          <Text strong ellipsis className="listing-card__address">
            {address}
          </Text>
        </div>
        <div className="listing-card__dimensions listing-card__dimensions--guests">
          <Icon type="user" />
          <Text>{numOfGuests} guests</Text>
        </div>
      </div>
    </Card>
  );
};

export default ListingCard;
