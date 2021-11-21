/// <reference types="cypress" />

export interface GQLResponse<T> {
  data: T;
  errors?: {
    message: string;
    locations: {
      line: string;
      column: string;
    }[];
  }[];
}

declare namespace Cypress {
  interface Chainable {
    getByTestId(id: string): Chainable<Element>;
    interceptGQL<T>(
      url: string,
      operation: string,
      data: GQLResponse<T>,
      alias?: string
    ): Chainable<Element>;
  }
}
