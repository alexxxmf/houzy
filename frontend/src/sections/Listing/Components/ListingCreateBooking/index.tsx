import { Button, Card, Divider, Typography } from "antd";
import React from "react";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker } from "../../../../components";
import { displayErrorMessage, priceFormatter } from "../../../../utils";
import { Viewer } from "../../../../types";
import { Listing_listing as Listing } from "../../../../graphql/queries/__generated__/Listing";

interface IProps {
  price: number;
  checkOutDate: Dayjs | null;
  setCheckOutDate: (date: Dayjs | null) => void;
  checkInDate: Dayjs | null;
  setCheckInDate: (date: Dayjs | null) => void;
  viewer: Viewer;
  host: Listing["host"];
}

const ListingCreateBooking = ({
  price,
  checkInDate,
  setCheckInDate,
  checkOutDate,
  setCheckOutDate,
  viewer,
  host,
}: IProps) => {
  const disabledDate = (currentDate?: Dayjs) => {
    if (currentDate) {
      const dateIsBeforeEndOfDay = currentDate.isBefore(dayjs().endOf("day"));

      return dateIsBeforeEndOfDay;
    } else {
      return false;
    }
  };
  const verifyAndSetCheckOutDate = (selectedCheckOutDate: Dayjs | null) => {
    if (checkInDate && selectedCheckOutDate) {
      if (selectedCheckOutDate?.isBefore(checkInDate, "days")) {
        return displayErrorMessage(
          `You can't book date of check out to be prior to check in!`
        );
      }
    }
    setCheckOutDate(selectedCheckOutDate);
  };

  const viewerIsHost = viewer.id === host.id;
  const checkInInputDisabled = !viewer.id || viewerIsHost || !host.hasWallet;
  const checkOutInputDisabled = !checkInDate || checkInInputDisabled;
  const buttonDisabled = !checkInDate || !checkOutDate || checkInInputDisabled;

  let buttonMessage = "You won't be charged yet";

  if (!viewer.id) {
    buttonMessage = "You have to be signed in to book a listing";
  } else if (viewerIsHost) {
    buttonMessage = "You cannot book your own listing";
  } else if (!host.hasWallet) {
    buttonMessage = "The host has disconnected from Stripe";
  }

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
              disabled={checkInInputDisabled}
              format={"YYYY/MM/DD"}
              showToday={false}
              disabledDate={disabledDate}
            />
          </div>
          <div className="listing-booking__card-date-picker">
            <Typography.Paragraph strong>Check Out</Typography.Paragraph>
            <DatePicker
              onChange={verifyAndSetCheckOutDate}
              value={checkOutDate}
              disabled={checkOutInputDisabled}
              format={"YYYY/MM/DD"}
              showToday={false}
              disabledDate={disabledDate}
            />
          </div>
        </div>
        <Divider />
        <Button
          disabled={buttonDisabled}
          size="large"
          type="primary"
          className="listing-booking__card-cta"
        >
          Request to book!
        </Button>
        <Typography.Text type="secondary" mark>
          {buttonMessage}
        </Typography.Text>
      </Card>
    </div>
  );
};

export default ListingCreateBooking;
