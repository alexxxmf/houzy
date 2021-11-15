import { setAliasMutation, setAliasAndResponse } from "utils";
import { listings, login } from "../fixtures";

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
      .click();
  });
});
