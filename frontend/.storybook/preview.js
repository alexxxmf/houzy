import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "../src/styles/index.css";

export const decorators = [(Story) => <Router>{Story()}</Router>];

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
