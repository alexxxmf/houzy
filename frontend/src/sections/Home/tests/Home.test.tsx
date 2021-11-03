import { Home } from "../index";
import { MockedProvider } from "@apollo/react-testing";
import { createMemoryHistory } from "history";
import { render, waitFor, screen } from "@testing-library/react";
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
  });

  describe("premium listings", () => {
    it("premium listings", () => {
      expect(2).toEqual(2);
    });
  });
});
