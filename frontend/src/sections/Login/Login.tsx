import React, { useEffect, useRef } from "react";
import { Card, Layout, Spin, Typography } from "antd";
import { useApolloClient, useMutation } from "@apollo/client";

import googleLogo from "../../assets/google_logo.jpg";
import { QUERY_AUTH_URL, MUTATION_LOG_IN } from "../../graphql";
import { authUrl as IAuthUrlData } from "../../graphql/queries/__generated__/authUrl";
import {
  logInVariables as ILogInVars,
  logIn as ILogInData,
} from "../../graphql/mutations/__generated__/logIn";
import { displayErrorMessage, displaySuccessNotification } from "../../utils";
import { Content } from "antd/lib/layout/layout";
import { ErrorBanner } from "../../components";
import { Redirect } from "react-router-dom";
import { Viewer } from "../../types";

interface ILoginProps {
  setViewer: (viewer: Viewer) => void;
  viewer: Viewer;
}

export const Login = ({ setViewer, viewer }: ILoginProps) => {
  const apolloClient = useApolloClient();

  const [logIn, { data: logInData, loading: logInLoading, error: logInError }] =
    useMutation<ILogInData, ILogInVars>(MUTATION_LOG_IN, {
      onCompleted: (logInData) => {
        if (logInData?.logIn?.token) {
          setViewer(logInData.logIn);
          sessionStorage.setItem("token", logInData.logIn.token);
          displaySuccessNotification("You've successfully logged in!");
        }
      },
      onError: (error) => {
        console.error(error);
      },
    });

  const logInRef = useRef(logIn);

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const code = urlSearchParams.get("code") ?? "";
    if (code) {
      logInRef.current({ variables: { input: { code } } });
    }
  }, []);

  useEffect(() => {
    console.log("check|useEffect|logInData", logInData);
  }, [logInData]);

  const onClickHandler = async () => {
    try {
      const {
        data: { authUrl },
      } = await apolloClient.query<IAuthUrlData>({
        query: QUERY_AUTH_URL,
      });
      window.location.href = authUrl;
    } catch (e) {
      displayErrorMessage(
        `Sorry! We weren't able to log you in. Please try again later!`
      );
    }
  };

  if (logInLoading) {
    return (
      <Content className="log-in">
        <Spin size="large" tip="Logging you in..." />
      </Content>
    );
  }

  if (logInData?.logIn?.id || viewer.id) {
    const viewerId = logInData?.logIn?.id ?? viewer.id;
    return <Redirect to={`/user/${viewerId}`} />;
  }

  const logInErrorBannerElement = logInError ? (
    <ErrorBanner description="Sorry! We weren't able to log you in. Please try again later!" />
  ) : null;

  return (
    <Layout.Content className="log-in">
      {logInErrorBannerElement}
      <Card className="log-in-card">
        <div className="log-in-card__intro">
          <Typography.Title level={3} className="log-in-card__intro-title">
            <span role="img" aria-label="wave">
              ✋
            </span>
          </Typography.Title>
          <Typography.Title level={3} className="log-in-card__intro-title">
            Log in to Houzy!
          </Typography.Title>
          <Typography.Text>
            Sign in with Google to start booking available rentals!
          </Typography.Text>
        </div>
        <button className="log-in-card__google-button" onClick={onClickHandler}>
          <img
            src={googleLogo}
            alt="Google Logo"
            className="log-in-card__google-button-logo"
          />
          <span className="log-in-card__google-button-text">
            Sign in with Google
          </span>
        </button>
        <Typography.Text type="secondary">
          Note: By signing in, you'll be redirected to the Google consent form
          to sign in with your Google account.
        </Typography.Text>
      </Card>
    </Layout.Content>
  );
};
