import { Button, Card, Divider, Typography } from "antd";
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
          <Divider />
          <div className="listing-booking__card-date-picker">
            <Typography.Paragraph strong>Check In</Typography.Paragraph>
            <DatePicker
              onChange={setCheckInDate}
              value={checkInDate}
              format={"YYYY/MM/DD"}
              showToday={false}
            />
          </div>
          <div className="listing-booking__card-date-picker">
            <Typography.Paragraph strong>Check Out</Typography.Paragraph>
            <DatePicker
              onChange={setCheckOutDate}
              value={checkOutDate}
              format={"YYYY/MM/DD"}
              showToday={false}
            />
          </div>
        </div>
        <Divider />
        <Button
          disabled={false}
          size="large"
          type="primary"
          className="listing-booking__card-cta"
        >
          Request to book!
        </Button>
      </Card>
    </div>
  );
};

export default ListingCreateBooking;
