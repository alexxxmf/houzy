import { setAliasMutation, setAliasAndResponse } from "utils";
import {
  listings,
  login,
  tokenResponse,
  booking,
  listing,
  hostListing,
} from "../fixtures";
import dayjs from "dayjs";

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
        erros: [],
      },
      "listings"
    );
    cy.interceptGQL(
      "http://localhost:9000/api",
      "logIn",
      {
        data: login,
        erros: [],
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
        erros: [],
      },
      "listing"
    );

    cy.interceptGQL(
      "http://localhost:9000/api",
      "hostListing",
      {
        data: hostListing,
        erros: [],
      },
      "hostListing"
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

  it.only(`As a user, when I'm on the home page
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
      .type("4")
      .getByTestId("title")
      .find("input")
      .type("fancy apartment")
      .getByTestId("description")
      .find("textarea")
      .type("gorgeous apartment")
      .getByTestId("address")
      .find("input")
      .type("Rodeo Drive 123")
      .getByTestId("city")
      .find("input")
      .type("Los Angeles")
      .getByTestId("province")
      .find("input")
      .type("California")
      .getByTestId("postal-code")
      .find("input")
      .type("12345")
      .getByTestId("price")
      .find("input")
      .type("1205")
      .getByTestId("image")
      .find("input[type=file]")
      .attachFile("test-image.jpeg")
      .get("button[type=submit]")
      .click()
      .wait("@hostListing")
      .url()
      .should(
        "eq",
        `${Cypress.config().baseUrl}/listing/${hostListing.hostListing.id}`
      );
  });
});
