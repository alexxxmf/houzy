import { Home } from "../index";
import { MockedProvider } from "@apollo/client/testing";
import { createMemoryHistory } from "history";
import { render, waitFor, screen, fireEvent } from "@testing-library/react";
import { Router } from "react-router-dom";

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
    it("renders the loading state when the query is loading", () => {
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
    });

    it("renders the intended UI when the query is successful", () => {});

    it("renders nothing when the query has an error", () => {});
  });
});
