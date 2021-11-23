import { setAliasMutation, setAliasAndResponse } from "utils";
import {
  listings,
  login,
  tokenResponse,
  booking,
  listing,
  hostListing,
  user,
  userWithoutStripeConn,
} from "../fixtures";
import { Listing as ListingData } from "../../src/graphql/queries/__generated__/Listing";
import dayjs from "dayjs";
import { ListingType } from "../../src/graphql/globalTypes";

const dataForCreatedListing = {
  title: "Fancy apartment",
  description: "Gorgeous views and super comfy",
  address: "Rodeo Drive 123",
  city: "Los Angeles",
  province: "California",
  postalCode: "12345",
  image: "test-image.jpeg",
  price: 12000,
  numOfGuests: 4,
};

export const newListing: ListingData = {
  listing: {
    ...dataForCreatedListing,
    id: "123456",
    host: {
      id: "1234",
      name: "Pepito",
      avatar:
        "https://lh3.googleusercontent.com/a-/AOh14GjZIFBQGChJSttvhydhZX8bMVW0NEVMx1USfsXbCQ=s100",
      hasWallet: true,
      __typename: "User",
    },
    type: ListingType.HOUSE,
    bookings: null,
    bookingsIndex: '{"2022":{"4":{}}}',
    __typename: "Listing",
  },
};

describe(`Houze user flows`, () => {
  beforeEach(() => {
    // Great suggestion for cypress
    // https://www.jayfreestone.com/writing/stubbing-graphql-cypress/
    Cypress.config("interceptions", {});

    cy.intercept("POST", "https://api.stripe.com/v1/tokens", tokenResponse).as(
      "postStripeToken"
    );

    cy.intercept("POST", "https://m.stripe.com/6", {});

    cy.intercept("POST", "https://r.stripe.com/0", {});

    cy.interceptGQL(
      "http://localhost:9000/api",
      "Listings",
      {
        data: listings,
        errors: [],
      },
      "listings"
    );
    cy.interceptGQL(
      "http://localhost:9000/api",
      "logIn",
      {
        data: login,
        errors: [],
      },
      "login"
    );
    cy.interceptGQL(
      "http://localhost:9000/api",
      "createBooking",
      {
        data: booking,
        erros: [],
      },
      "createBooking"
    );
    cy.interceptGQL(
      "http://localhost:9000/api",
      "Listing",
      {
        data: listing,
        errors: [],
      },
      "listing"
    );

    cy.interceptGQL(
      "http://localhost:9000/api",
      "hostListing",
      {
        data: hostListing,
        errors: [],
      },
      "hostListing"
    );

    cy.interceptGQL(
      "http://localhost:9000/api",
      "User",
      {
        data: userWithoutStripeConn,
        errors: [],
      },
      "userWithoutStripeConn"
    );
  });
  it(`As a user, when I'm on the home page
    When I see a selection of premium listings
    And I want to click on a specific one
    Then I am redirected to the listing detail page
    And I can see listing details
    And I can see host details
    And I can book that listing
    And I can see a popup messaging stating my booking was successful`, () => {
    const now = dayjs();
    const tomorrow = now.add(1, "days").format("YYYY-MM-DD");
    const twoDaysAgo = now.subtract(2, "days").format("YYYY-MM-DD");
    const fourDaysAhead = now.add(4, "days").format("YYYY-MM-DD");

    cy.visit("/")
      .wait("@login")
      .wait("@listings")
      .getByTestId("home-listings")
      .children()
      .eq(0)
      .should("contain.text", "Premium Listings")
      .getByTestId("home-listings")
      .find("a")
      .should("have.length", 4)
      .getByTestId("listing-5d378db94e84753160e08b4c")
      .click()
      .wait("@listing")
      .getByTestId("listing-booking-date-picker-check-in")
      .children()
      .eq(0)
      .should("contain.text", "Check In")
      .getByTestId("listing-booking-date-picker-check-in")
      .children()
      .eq(1)
      .click()
      .get(`td[title*="${tomorrow}"]`)
      .eq(0)
      .click()
      .getByTestId("listing-booking-date-picker-check-out")
      .should("contain.text", "Check Out")
      .getByTestId("listing-booking-date-picker-check-out")
      .children()
      .eq(1)
      .click()
      .get(`td[title*="${twoDaysAgo}"]`)
      .eq(1)
      // This means this date is not clickable
      .should("have.css", "pointer-events", "none")
      .getByTestId("listing-booking-date-picker-check-out")
      .children()
      .eq(1)
      .click()
      .get(`td[title*="${fourDaysAhead}"]`)
      .eq(1)
      .click()
      .getByTestId("listing-booking-cta-btn")
      .click()
      .getByTestId("listing-booking-modal")
      .should("be.visible")
      .should("contain.text", "Book your trip")
      .should("contain.text", tomorrow.split("-")[2])
      .should("contain.text", fourDaysAhead.split("-")[2])
      .should("contain.text", tomorrow.split("-")[0])
      .get(`td[title*="${fourDaysAhead}"]`)
      .get("#stripe-elements-card-field")
      .within(() => {
        cy.fillElementsInput("cardNumber", "4242424242424242");
        cy.fillElementsInput("cardExpiry", "1025"); // MMYY
        cy.fillElementsInput("cardCvc", "123");
      })
      .getByTestId("listing-booking-modal-cta-btn")
      .click()
      .wait("@postStripeToken")
      .wait("@createBooking")
      .get(".ant-notification")
      .should("contain.text", "You've successfully booked the listing!");
  });

  it(`As a user, when I'm on the home page
  When I see the host menu item in the header
  And I click on it
  Then I am redirected to the create listing page
  And I can fill the form to create a listing`, () => {
    cy.visit("/")
      .wait("@login")
      .wait("@listings")
      .get('[role="menu"')
      .children()
      .eq(0)
      .click()
      .url()
      .should("eq", `${Cypress.config().baseUrl}/host`)
      .getByTestId("home-type")
      .find("label")
      .eq(1)
      .click()
      .getByTestId("num-of-guests")
      .find("input")
      .type(`${dataForCreatedListing.numOfGuests}`)
      .getByTestId("title")
      .find("input")
      .type(`${dataForCreatedListing.title}`)
      .getByTestId("description")
      .find("textarea")
      .type(`${dataForCreatedListing.description}`)
      .getByTestId("address")
      .find("input")
      .type(`${dataForCreatedListing.address}`)
      .getByTestId("city")
      .find("input")
      .type(`${dataForCreatedListing.city}`)
      .getByTestId("province")
      .find("input")
      .type(`${dataForCreatedListing.province}`)
      .getByTestId("postal-code")
      .find("input")
      .type(`${dataForCreatedListing.postalCode}`)
      .getByTestId("price")
      .find("input")
      .type(`${dataForCreatedListing.price}`)
      .getByTestId("image")
      .find("input[type=file]")
      .attachFile(`${dataForCreatedListing.image}`)
      .get("button[type=submit]")
      .click()
      .interceptGQL(
        "http://localhost:9000/api",
        "Listing",
        {
          data: newListing,
          errors: [],
        },
        "createdListing"
      )
      .wait("@hostListing")
      .url()
      .should(
        "eq",
        `${Cypress.config().baseUrl}/listing/${hostListing.hostListing.id}`
      )
      .wait("@createdListing");
  });

  // // TODO: find an elegant way to deal with stripe's oauth
  // // better to avoid inject cypressGlobals to conditionally play with the window object
  // // or something similar
  // it.only(`As a user, when I'm on the home page
  // When I see the app header
  // And I click on my profile
  // Then I am redirected to my user page
  // And I can connect my account to stripe
  // and I can disconnect it back to how it was`, () => {
  //   cy.visit("/")
  //     .wait("@login")
  //     .wait("@listings")
  //     .get('[role="menu"')
  //     .children()
  //     .eq(1)
  //     .click()
  //     .get('a[href="/user/110304735686084337427"]')
  //     .click()

  //     .wait("@userWithoutStripeConn")
  //     .getByTestId("user-profile")
  //     .should("contain", `Name: ${userWithoutStripeConn.user.name}`)
  //     .and("contain", `Contact: ${userWithoutStripeConn.user.contact}`)
  //     .and("contain", "Connect with Stripe");
  //   cy.window()
  //     .then((window) => {
  //       // @ts-ignore
  //       cy.stub(window, "redirectToStripe");
  //     })
  //     .getByTestId("btn-connect-stripe")
  //     .click();
  //   // https://connect.stripe.com/oauth/v2/authorize?response_type=code&client_id=ca_Lk5K9KvQHZencmdvQnnXMrDStgoSqlwS&scope=read_write
  // });
});
