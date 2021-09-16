import { Card } from "antd";
import React from "react";

interface IProps {
  price: number;
}

const ListingCreateBooking = ({ price }: IProps) => {
  return (
    <div className="listing-booking">
      <Card className="listing-booking__card">{price}</Card>
    </div>
  );
};

export default ListingCreateBooking;
