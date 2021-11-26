import React from "react";
import { storiesOf } from "@storybook/react";
import { PageSkeleton } from "./index";

storiesOf("components/PageSkeleton", module).add("Standard", () => (
  <PageSkeleton />
));
