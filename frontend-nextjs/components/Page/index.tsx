import type { AppProps } from "next/app";
import { Layout } from "antd";
import { AppHeader } from "../../components/AppHeader";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import "@stripe/stripe-js";
import { Viewer } from "../../types";
import { ReactNode, useEffect, useRef, useState } from "react";
import { ApolloProvider } from "@apollo/client";
import { useMutation } from "@apollo/client";
import { client, MUTATION_LOG_IN } from "../../graphql";
import {
  LogIn as LogInData,
  LogInVariables,
} from "../../graphql/mutations/__generated__/logIn";

const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY as string
);

const initialViewer: Viewer = {
  id: null,
  token: null,
  avatar: null,
  hasWallet: null,
  didRequest: false,
};

interface Props {
  children: ReactNode;
}

const Page = ({ children }: Props) => {
  const [viewer, setViewer] = useState<Viewer>(initialViewer);
  const [logIn, { error: logInError, loading: logInLoading }] = useMutation<
    LogInData,
    LogInVariables
  >(MUTATION_LOG_IN, {
    onCompleted: (logInData) => {
      if (logInData?.logIn) {
        setViewer(logInData.logIn);
        if (logInData?.logIn?.token) {
          sessionStorage.setItem(
            process.env.REACT_APP_CSRF_TOKEN_KEY || "",
            logInData.logIn.token
          );
        } else {
          sessionStorage.removeItem(
            process.env.REACT_APP_CSRF_TOKEN_KEY || "" || ""
          );
        }
      }
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const logInRef = useRef(logIn);

  useEffect(() => {
    logInRef.current();
  }, []);

  return (
    <Layout id="app">
      <AppHeader />
      {children}
    </Layout>
  );
};

export default Page;
