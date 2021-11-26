import React from "react";
import { storiesOf } from "@storybook/react";
import { ErrorBanner } from "./ErrorBanner";

storiesOf("components/ErrorBanner", module).add("Standard", () => (
  <ErrorBanner message="test message" />
));
