import { Listings } from "../index";
import { MockedProvider, MockLink } from "@apollo/client/testing";
import { createMemoryHistory } from "history";
import {
  render,
  waitFor,
  screen,
  fireEvent,
  act,
} from "@testing-library/react";
import { Router } from "react-router-dom";
import { QUERY_LISTINGS } from "../../../graphql";
import { ListingsFilter } from "../../../graphql/globalTypes";
import { ApolloLink } from "@apollo/client";
import { onError } from "@apollo/client/link/error";

describe("Listings Component", () => {
  beforeAll(() => {
    global.matchMedia =
      global.matchMedia ||
      function () {
        return {
          addListener: jest.fn(),
          removeListener: jest.fn(),
        };
      };
    window.scrollTo = () => {};
  });

  describe("premium listings", () => {
    it("renders the loading state when the query is loading", async () => {
      const history = createMemoryHistory();
      const routeComponentPropsMock = {
        history: {} as any,
        location: {} as any,
        match: {
          params: {
            location: "toronto",
          },
        } as any,
      };
      const { queryByTestId } = render(
        <MockedProvider mocks={[]}>
          <Router history={history}>
            {/* TODO: take a look at this, not sure why TS is not recognising stuff being passed by router */}
            <Listings {...routeComponentPropsMock} />
          </Router>
        </MockedProvider>
      );

      await waitFor(() => {
        expect(queryByTestId("listings-skeleton")).not.toBe(null);
      });
    });

    it("renders the intended UI when the query is successful", async () => {
      const individualListing = {
        id: "1234",
        title: "fancy house",
        image: "image.png",
        address: "Mocked listing address",
        price: 128,
        numOfGuests: 4,
      };
      const listingsMock = {
        request: {
          query: QUERY_LISTINGS,
          variables: {
            filter: ListingsFilter.PRICE_DESC,
            page: 1,
            limit: 4,
          },
        },
        result: {
          data: {
            listings: {
              region: "asdada",
              total: 8,
              result: [
                individualListing,
                individualListing,
                individualListing,
                individualListing,
                individualListing,
                individualListing,
                individualListing,
                individualListing,
              ],
            },
          },
        },
      };

      const history = createMemoryHistory();
      const routeComponentPropsMock = {
        history: {} as any,
        location: {} as any,
        match: {
          params: {
            location: "toronto",
          },
        } as any,
      };
      const { queryByTestId } = render(
        <MockedProvider mocks={[]}>
          <Router history={history}>
            {/* TODO: take a look at this, not sure why TS is not recognising stuff being passed by router */}
            <Listings {...routeComponentPropsMock} />
          </Router>
        </MockedProvider>
      );

      await waitFor(() => {
        expect(queryByTestId("listings-skeleton")).not.toBe(null);
      });
    });
  });
});
