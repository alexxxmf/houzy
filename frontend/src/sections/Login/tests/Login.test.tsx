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
import { MUTATION_LOG_IN, QUERY_AUTH_URL } from "../../../graphql";
import { ListingsFilter } from "../../../graphql/globalTypes";
import { ApolloLink } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { Login } from "../Login";
import { Viewer } from "../../../types";
import { GraphQLError } from "graphql/error/GraphQLError";

const defaultProps = {
  setViewer: (viewer: Viewer) => {},
  viewer: {
    didRequest: true,
    id: "",
    token: "",
    avatar: "",
    hasWallet: false,
  },
};

describe("Login", () => {
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
    Object.defineProperty(window, "location", {
      value: { assign: jest.fn() },
    });
  });

  describe("auth url query", () => {
    it("redirects the user when query is successful", async () => {
      const authUrlMock = {
        request: {
          query: QUERY_AUTH_URL,
        },
        result: {
          data: {
            authUrl: "https://google.com/signin",
          },
        },
      };
      const history = createMemoryHistory();

      const { queryByTestId } = render(
        <MockedProvider mocks={[authUrlMock]} addTypename={false}>
          <Router history={history}>
            <Login {...defaultProps} />
          </Router>
        </MockedProvider>
      );

      const logInBtn = queryByTestId("log-in-google-btn");

      fireEvent.click(logInBtn as HTMLButtonElement);

      await waitFor(() => {
        expect(window.location.assign).toHaveBeenCalledWith(
          "https://google.com/signin"
        );
      });
    });

    it("does not redirect the user when query fails", async () => {
      const authUrlMock = {
        request: {
          query: QUERY_AUTH_URL,
        },
        errors: [new GraphQLError("Something went wrong")],
      };
      const history = createMemoryHistory();

      const { queryByTestId, queryByText } = render(
        <MockedProvider mocks={[authUrlMock]} addTypename={false}>
          <Router history={history}>
            <Login {...defaultProps} />
          </Router>
        </MockedProvider>
      );

      const logInBtn = queryByTestId("log-in-google-btn");

      fireEvent.click(logInBtn as HTMLButtonElement);

      await waitFor(() => {
        expect(window.location.assign).not.toHaveBeenCalledWith(
          "https://google.com/signin"
        );
        expect(
          queryByText(
            "Sorry! We weren't able to log you in. Please try again later!"
          )
        ).not.toBeNull();
      });
    });
  });

  describe("login mutation", () => {
    it("when no code exists in the /login route, the mutation is not fired", async () => {
      const logInMock = {
        request: {
          query: MUTATION_LOG_IN,
          variables: {
            input: {
              code: "1234",
            },
          },
        },
        result: {
          data: {
            id: "111",
            token: "4321",
            avatar: "image.png",
            hasWallet: false,
            didRequest: true,
          },
        },
      };

      const history = createMemoryHistory();

      render(
        <MockedProvider mocks={[logInMock]} addTypename={false}>
          <Router history={history}>
            <Login {...defaultProps} />
          </Router>
        </MockedProvider>
      );

      await waitFor(() => {
        expect(history.location.pathname).not.toBe("/user/111");
      });
    });

    describe("when code exists in the /login route as a query parameter", () => {
      it("redirects the user to ther user page when the mutation is successful", async () => {
        const logInMock = {
          request: {
            query: MUTATION_LOG_IN,
            variables: {
              input: {
                code: "1234",
              },
            },
          },
          result: {
            data: {
              logIn: {
                id: "111",
                token: "4321",
                avatar: "image.png",
                hasWallet: false,
                didRequest: true,
              },
            },
          },
        };

        const history = createMemoryHistory({
          initialEntries: ["/login?code=1234"],
        });

        render(
          <MockedProvider mocks={[logInMock]} addTypename={false}>
            <Router history={history}>
              <Login {...defaultProps} />
            </Router>
          </MockedProvider>
        );

        await waitFor(() => {
          expect(history.location.pathname).toBe("/user/111");
        });
      });

      it("does not redirect the user to ther user page and displays an error message when the mutation is unsuccessful", async () => {
        const logInMock = {
          request: {
            query: MUTATION_LOG_IN,
            variables: {
              input: {
                code: "1234",
              },
            },
          },
          errors: [new GraphQLError("Somethign went wrong")],
        };

        const history = createMemoryHistory();

        const { queryByText } = render(
          <MockedProvider mocks={[logInMock]} addTypename={false}>
            <Router history={history}>
              <Login {...defaultProps} />
            </Router>
          </MockedProvider>
        );

        await waitFor(() => {
          expect(history.location.pathname).not.toBe("/user/111");
          expect(
            queryByText(
              "Sorry! We weren't able to log you in. Please try again later!"
            )
          ).not.toBeNull();
        });
      });
    });
  });
});
