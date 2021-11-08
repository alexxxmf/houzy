import { Home } from "../index";
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

describe("Home Component", () => {
  // this is to avoid some weird problem with event listeners regarding this window prop
  // https://stackoverflow.com/questions/64813447/cannot-read-property-addlistener-of-undefined-react-testing-library
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

  describe("search input", () => {
    it("renders an empty search input on initial render", async () => {
      const history = createMemoryHistory();
      const routeComponentPropsMock = {
        history: {} as any,
        location: {} as any,
        match: {} as any,
      };
      render(
        <MockedProvider mocks={[]}>
          <Router history={history}>
            {/* TODO: take a look at this, not sure why TS is not recognising stuff being passed by router */}
            <Home {...routeComponentPropsMock} />
          </Router>
        </MockedProvider>
      );

      const searchInput: HTMLInputElement = screen.getByTestId(
        "home-hero-search-bar"
      );

      expect(searchInput.value).toEqual("");
    });
    it("redirects the user to the listings page when a valid search is provided", () => {
      const history = createMemoryHistory();
      const routeComponentPropsMock = {
        history,
        location: {} as any,
        match: {} as any,
      };
      render(
        <MockedProvider mocks={[]}>
          <Router history={history}>
            {/* TODO: take a look at this, not sure why TS is not recognising stuff being passed by router */}
            <Home {...routeComponentPropsMock} />
          </Router>
        </MockedProvider>
      );

      const searchInput: HTMLInputElement = screen.getByTestId(
        "home-hero-search-bar"
      );

      fireEvent.change(searchInput, {
        target: { value: "London" },
      });
      // we could have also done it by selecting the button and triggering an onCLick
      fireEvent.keyDown(searchInput, {
        key: "Enter",
        keyCode: 13,
      });

      expect(history.location.pathname).toBe("/listings/London");
    });

    it("does not redirect the user to the listings page when an invalid search is provided", () => {
      const history = createMemoryHistory();
      const routeComponentPropsMock = {
        history,
        location: {} as any,
        match: {} as any,
      };
      render(
        <MockedProvider mocks={[]}>
          <Router history={history}>
            {/* TODO: take a look at this, not sure why TS is not recognising stuff being passed by router */}
            <Home {...routeComponentPropsMock} />
          </Router>
        </MockedProvider>
      );

      const searchInput: HTMLInputElement = screen.getByTestId(
        "home-hero-search-bar"
      );

      fireEvent.change(searchInput, {
        target: { value: "" },
      });

      fireEvent.keyDown(searchInput, {
        key: "Enter",
        keyCode: 13,
      });

      expect(history.location.pathname).toBe("/");
    });
  });

  describe("premium listings", () => {
    it("renders the loading state when the query is loading", async () => {
      const history = createMemoryHistory();
      const routeComponentPropsMock = {
        history: {} as any,
        location: {} as any,
        match: {} as any,
      };
      const { queryByTestId } = render(
        <MockedProvider mocks={[]}>
          <Router history={history}>
            {/* TODO: take a look at this, not sure why TS is not recognising stuff being passed by router */}
            <Home {...routeComponentPropsMock} />
          </Router>
        </MockedProvider>
      );

      await waitFor(() => {
        expect(queryByTestId("home-listings-skeleton")).not.toBe(null);
      });
    });

    it("renders the intended UI when the query is successful", async () => {
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
              total: 4,
              result: [
                {
                  id: "1234",
                  title: "fancy house",
                  image: "image.png",
                  address: "Mocked listing address",
                  price: 128,
                  numOfGuests: 4,
                },
              ],
            },
          },
        },
      };

      const history = createMemoryHistory();
      const routeComponentPropsMock = {
        history: {} as any,
        location: {} as any,
        match: {} as any,
      };

      const { queryByTestId } = render(
        // From apollo docs
        // In the example above, we set the addTypename prop of MockedProvider to false. This prevents Apollo Client
        // from automatically adding the special __typename field to every object it queries for (it does this by default to support data normalization in the cache).
        // We don't want to automatically add __typename to GET_DOG_QUERY in our test, because then it won't match the shape of the query that our mock is expecting
        <MockedProvider mocks={[listingsMock]} addTypename={false}>
          <Router history={history}>
            {/* TODO: take a look at this, not sure why TS is not recognising stuff being passed by router */}
            <Home {...routeComponentPropsMock} />
          </Router>
        </MockedProvider>
      );

      await waitFor(() => {
        expect(queryByTestId("home-listings")).not.toBe(null);
      });
    });

    it("renders nothing when the query has an error", () => {});
  });
});
