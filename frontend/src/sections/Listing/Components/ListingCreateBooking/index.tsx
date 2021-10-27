import { Button, Card, Divider, Typography } from "antd";
import React from "react";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker } from "../../../../components";
import { displayErrorMessage, priceFormatter } from "../../../../utils";
import { Viewer } from "../../../../types";
import { Listing_listing as Listing } from "../../../../graphql/queries/__generated__/Listing";
import { BookingsIndex } from "./types";

interface IProps {
  price: number;
  checkOutDate: Dayjs | null;
  setCheckOutDate: (date: Dayjs | null) => void;
  checkInDate: Dayjs | null;
  setCheckInDate: (date: Dayjs | null) => void;
  viewer: Viewer;
  host: Listing["host"];
  bookingsIndex: Listing["bookingsIndex"];
  setModalVisible: (modalVisible: boolean) => void;
}

const ListingCreateBooking = ({
  price,
  checkInDate,
  setCheckInDate,
  checkOutDate,
  setCheckOutDate,
  viewer,
  host,
  bookingsIndex,
  setModalVisible,
}: IProps) => {
  const bookingsIndexJSON: BookingsIndex = JSON.parse(bookingsIndex);

  const dateIsBooked = (currentDate?: Dayjs) => {
    const year = dayjs(currentDate).year();
    const month = dayjs(currentDate).month();
    const day = dayjs(currentDate).date();

    if (bookingsIndexJSON[year] && bookingsIndexJSON[year][month]) {
      return Boolean(bookingsIndexJSON[year][month][day]);
    } else {
      return false;
    }
  };

  const disabledDate = (currentDate?: Dayjs) => {
    if (currentDate) {
      const dateIsBeforeEndOfDay = currentDate.isBefore(dayjs().endOf("day"));

      return dateIsBeforeEndOfDay || dateIsBooked(currentDate);
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

      let dateCursor = checkInDate;

      while (dayjs(dateCursor).isBefore(selectedCheckOutDate)) {
        dateCursor = dayjs(dateCursor).add(1, "days");

        const year = dayjs(dateCursor).year();
        const month = dayjs(dateCursor).month();
        const day = dayjs(dateCursor).date();

        if (
          bookingsIndexJSON[year] &&
          bookingsIndexJSON[year][month] &&
          bookingsIndexJSON[year][month][day]
        ) {
        }
        return displayErrorMessage(
          "You can't book a period of time that overlaps existing bookings. Please try again!"
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
          onClick={() => {
            setModalVisible(true);
          }}
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
