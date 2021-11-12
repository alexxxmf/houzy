import { setAliasMutation, setAliasAndResponse } from "utils";
import { listings } from "../fixtures";

describe(`Houze user flows`, () => {
  beforeEach(() => {
    // TODO: pass this as cypress env variable
    cy.intercept("POST", "http://localhost:9000/api", (req) => {
      setAliasAndResponse(req, "Listings", "Query", {
        data: listings,
      });

      // Mutations
      setAliasMutation(req, "Login");
    });
  });
  it(`As a user, when I'm on the home page
    When I see a selection of listings for specific locations
    And I want to click on a specific one
    Then I am redirected to the listings page
    And I can see a sorted collection of listings`, () => {
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
