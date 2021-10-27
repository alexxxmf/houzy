import React from "react";
import { Modal, Button, Divider, Typography } from "antd";
import { Dayjs } from "dayjs";
import { KeyOutlined } from "@ant-design/icons";
import dayjs from "rc-picker/node_modules/dayjs";
import { priceFormatter } from "../../../../utils";

interface Props {
  modalVisible: boolean;
  setModalVisible: (modalVisible: boolean) => void;
  price: number;
  checkInDate: Dayjs;
  checkOutDate: Dayjs;
}

const { Paragraph, Text, Title } = Typography;

export const ListingCreateBookingModal = ({
  modalVisible,
  setModalVisible,
  price,
  checkInDate,
  checkOutDate,
}: Props) => {
  const daysBooked = checkOutDate.diff(checkInDate, "days") + 1;
  const listingPrice = price * daysBooked;
  const houzyFee = 0.05 * listingPrice;
  const totalPrice = listingPrice + houzyFee;

  return (
    <Modal
      visible={modalVisible}
      centered
      footer={null}
      onCancel={() => setModalVisible(false)}
    >
      <div className="listing-booking-modal">
        <div className="listing-booking-modal__intro">
          <Title className="listing-booking-modal__intro-title">
            <KeyOutlined />
          </Title>
          <Title className="listing-booking-modal__intro-title">
            Book your trip
          </Title>
          <Paragraph>
            Enter your payment information to book the listing from the dates
            between
            <Text mark strong>
              {dayjs(checkInDate).format("MMMM Do YYYY")}
            </Text>
            <Text mark strong>
              {dayjs(checkOutDate).format("MMMM Do YYYY")}
            </Text>
            , inclusive.
          </Paragraph>
        </div>

        <Divider />

        <div className="listing-booking-modal__charge-summary">
          <Paragraph>
            {priceFormatter(price)} * {daysBooked} days
            <Text strong>{priceFormatter(price)}</Text>
          </Paragraph>
          <Paragraph>
            Houzy Fee <sub>~ 5%</sub>
            <Text strong>{priceFormatter(houzyFee)}</Text>
          </Paragraph>
          <Paragraph>
            Total = <Text strong>{priceFormatter(totalPrice)}</Text>
          </Paragraph>
        </div>

        <Divider />

        <div className="listing-booking-modal__stripe-card-section">
          <Button
            size="large"
            type="primary"
            className="listing-booking-modal__cta"
          >
            Book
          </Button>
        </div>
      </div>
    </Modal>
  );
};
