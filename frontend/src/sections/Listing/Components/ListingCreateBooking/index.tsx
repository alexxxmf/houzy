import { Card, Typography } from "antd";
import React from "react";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker } from "../../../../components";
import { priceFormatter } from "../../../../utils";

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
  checkOutDate,
  setCheckOutDate,
}: IProps) => {
  return (
    <div className="listing-booking">
      <Card className="listing-booking__card">
        <div>
          <Typography.Paragraph>
            <Typography.Title level={2} className="listing-booking__card-title">
              {priceFormatter(price)}
              <span>/day</span>
            </Typography.Title>
          </Typography.Paragraph>
        </div>
      </Card>
      <DatePicker onChange={setCheckInDate} value={checkInDate} />
    </div>
  );
};

export default ListingCreateBooking;
