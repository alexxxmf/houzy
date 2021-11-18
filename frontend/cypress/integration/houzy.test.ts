import { setAliasMutation, setAliasAndResponse } from "utils";
import { listings, login } from "../fixtures";
import dayjs from "dayjs";

describe(`Houze user flows`, () => {
  beforeEach(() => {
    // TODO: pass this as cypress env variable
    cy.intercept("POST", "http://localhost:9000/api", (req) => {
      setAliasAndResponse(req, "Listings", "Query", {
        data: listings,
      });

      setAliasAndResponse(req, "logIn", "Mutation", {
        data: login,
      });
    });
  });
  it(`As a user, when I'm on the home page
    When I see a selection of premium listings
    And I want to click on a specific one
    Then I am redirected to the listing detail page
    And I can see listing details
    And I can see host details
    And I can book that listing`, () => {
    const now = dayjs();
    const tomorrow = now.add(1, "days").format("YYYY-MM-DD");
    const twoDaysAgo = now.subtract(2, "days").format("YYYY-MM-DD");
    const twoDaysStr = now.subtract(2, "days").format("YYYY-MM-DD");
    const fourDaysAhead = now.add(4, "days").format("YYYY-MM-DD");

    cy.visit("/")
      .wait("@gqlListingsQuery")
      .getByTestId("home-listings")
      .children()
      .eq(0)
      .should("contain.text", "Premium Listings")
      .getByTestId("home-listings")
      .find("a")
      .should("have.length", 4)
      .getByTestId("listing-5d378db94e84753160e08b4c")
      .click()
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
      .should("contain.text", "24")
      .should("contain.text", "27")
      .should("contain.text", "2022")
      .get(`td[title*="${fourDaysAhead}"]`)

      .get("#stripe-elements-card-field")
      .within(() => {
        cy.fillElementsInput("cardNumber", "4242424242424242");
        cy.fillElementsInput("cardExpiry", "1025"); // MMYY
        cy.fillElementsInput("cardCvc", "123");
      })
      .getByTestId("listing-booking-modal-cta-btn");
  });
});
