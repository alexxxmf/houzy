Cypress.Commands.add("getByTestId", (testid, timeout = 4000) => {
  cy.get(`[data-testid="${testid}"]`, { timeout });
});

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

Cypress.Commands.add(
  "interceptGQL",
  <T>(url: string, operation: string, data: GQLResponse<T>, alias?: string) => {
    // Retrieve any previously registered interceptions.
    const previous = Cypress.config("interceptions");
    const alreadyRegistered = url in previous;

    const next = {
      ...(previous[url] || {}),
      [operation]: { alias, data },
    };

    // Merge in the new interception.
    Cypress.config("interceptions", {
      ...previous,
      [url]: next,
    });

    // No need to register handler more than once per URL. Operation data is
    // dynamically chosen within the handler.
    if (alreadyRegistered) {
      return;
    }

    cy.intercept("POST", url, (req) => {
      const interceptions = Cypress.config("interceptions");
      const match = interceptions[url]?.[req.body.operationName];

      if (match) {
        req.alias = match.alias;
        req.reply({ body: match.data });
      }
    });
  }
);
