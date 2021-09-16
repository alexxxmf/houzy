import { Card } from "antd";
import React from "react";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker } from "../../../../components";

interface IProps {
  price: number;
  checkOutDate: Dayjs | null;
  setCheckOutDate: (date: Dayjs | null) => void;
  checkInDate: Dayjs | null;
  setCheckInDate: (date: Dayjs | null) => void;
}

const ListingCreateBooking = ({
  price,
  checkInDate,
  setCheckInDate,
}: IProps) => {
  return (
    <div className="listing-booking">
      <Card className="listing-booking__card">{price}</Card>
      <DatePicker onChange={setCheckInDate} value={checkInDate} />
    </div>
  );
};

export default ListingCreateBooking;
