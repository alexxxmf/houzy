import React from "react";
import { Card, Layout, Typography } from "antd";
import googleLogo from "../../assets/google_logo.jpg";

export const Login = () => {
  return (
    <Layout.Content className="log-in">
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
        <button className="log-in-card__google-button">
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
