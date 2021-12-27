import React from "react";
import { Modal, Button, Divider, Typography } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { KeyOutlined } from "@ant-design/icons";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { StripeCardElement } from "@stripe/stripe-js";
import {
  displayErrorMessage,
  displaySuccessNotification,
  priceFormatter,
} from "../../../../utils";
import { useMutation } from "@apollo/client";
import {
  createBookingVariables as CreateBookingVariables,
  createBooking_createBooking as CreateBookingData,
} from "../../../../graphql/mutations/__generated__/createBooking";
import { MUTATION_CREATE_BOOKING } from "../../../../graphql";

interface Props {
  modalVisible: boolean;
  setModalVisible: (modalVisible: boolean) => void;
  price: number;
  checkInDate: Dayjs;
  checkOutDate: Dayjs;
  id: string;
  clearBookingData: () => void;
  handleListingRefetch: () => Promise<void>;
}

const { Paragraph, Text, Title } = Typography;

export const ListingCreateBookingModal = ({
  modalVisible,
  setModalVisible,
  price,
  checkInDate,
  checkOutDate,
  id,
  handleListingRefetch,
  clearBookingData,
}: Props) => {
  const stripe = useStripe();
  const elements = useElements();

  const [createBooking, { loading, error }] = useMutation<
    CreateBookingData,
    CreateBookingVariables
  >(MUTATION_CREATE_BOOKING, {
    onCompleted: () => {
      clearBookingData();
      displaySuccessNotification(
        "You've successfully booked the listing!",
        "Booking history can always be found in your user page"
      );
      handleListingRefetch();
    },
    onError: () => {
      displayErrorMessage(
        "Sorry! We weren't able to successfully book the listing. please try again alter"
      );
    },
  });
  const daysBooked = checkOutDate.diff(checkInDate, "days") + 1;
  const listingPrice = price * daysBooked;

  const handleCreateBooking = async () => {
    if (!stripe || !elements) {
      return displayErrorMessage(
        "Sorry you weren't able to connect with Stripe"
      );
    }

    const cardElement = elements.getElement(CardElement);

    const stripeToken = await stripe.createToken(
      cardElement as StripeCardElement
    );

    if (stripeToken && stripeToken.token) {
      createBooking({
        variables: {
          input: {
            source: stripeToken.token.id,
            checkIn: dayjs(checkInDate).format("YYYY-MM-DD"),
            checkOut: dayjs(checkOutDate).format("YYYY-MM-DD"),
            id,
          },
        },
      });
    } else {
      displayErrorMessage(
        error && error.message
          ? error.message
          : "Sorry! We weren't able to book the listing. Please try again later."
      );
    }
  };

  return (
    <Modal
      visible={modalVisible}
      centered
      footer={null}
      onCancel={() => setModalVisible(false)}
    >
      <div
        className="listing-booking-modal"
        data-testid="listing-booking-modal"
      >
        <div className="listing-booking-modal__intro">
          <Title className="listing-booking-modal__intro-title">
            <KeyOutlined />
          </Title>
          <Title className="listing-booking-modal__intro-title">
            Book your trip
          </Title>
          <Paragraph>
            Enter your payment information to book the listing from the dates
            between{" "}
            <Text mark strong>
              {dayjs(checkInDate).format("MMMM Do YYYY")}
            </Text>{" "}
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
          </Paragraph>
          <Paragraph className="listing-booking-modal__charge-summary-total">
            Total = <Text strong>{priceFormatter(listingPrice)}</Text>
          </Paragraph>
        </div>

        <Divider />

        <div className="listing-booking-modal__stripe-card-section">
          <CardElement
            className="listing-booking-modal__stripe-card"
            id="stripe-elements-card-field"
            options={{ hidePostalCode: true }}
          />
          <Button
            size="large"
            type="primary"
            className="listing-booking-modal__cta"
            onClick={handleCreateBooking}
            loading={loading}
            data-testid="listing-booking-modal-cta-btn"
          >
            Book
          </Button>
        </div>
      </div>
    </Modal>
  );
};
