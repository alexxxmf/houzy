import React from "react";
import { storiesOf } from "@storybook/react";
import { AppHeaderSkeleton } from "./AppHeaderSkeleton";

storiesOf("components/AppHeaderSkeleton", module).add("Standard", () => (
  <AppHeaderSkeleton />
));
