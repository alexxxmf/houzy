Cypress.Commands.add("getByTestId", (testid, timeout = 4000) => {
  cy.get(`[data-testid="${testid}"]`, { timeout });
});
