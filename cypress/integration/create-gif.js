/// <reference types="cypress" />

it("create README gif", () => {
  cy.viewport(1000, 600);
  cy.clearViewport();

  cy.visit("https://christianflach.de/OpenWeatherMap-PHP-API");
  cy.wait(3000);
  cy.get("#search_input_react")
    .focus()
    .wait(500)
    .type("php{enter}", { delay: 750 });
  cy.wait(1000);
  cy.get("#search_input_react")
    .focus()
    .wait(500)
    .type("api{enter}", { delay: 750 });
  cy.wait(3000);
  cy.visit("https://christianflach.de/OpenWeatherMap-PHP-API");
  cy.get("#search_input_react").focus();
});
