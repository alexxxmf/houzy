import "../styles/globals.css";
import type { AppProps } from "next/app";
import { loadStripe } from "@stripe/stripe-js";
import "@stripe/stripe-js";
import { ApolloProvider } from "@apollo/client";
import { client } from "../graphql";
import Page from "../components/Page";

const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY as string
);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <Page>
        <Component {...pageProps} />
      </Page>
    </ApolloProvider>
  );
}

export default MyApp;
