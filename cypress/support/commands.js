// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

// https://github.com/cypress-io/cypress/issues/2970
Cypress.Commands.add("clearViewport", () => {
  const runnerContainer =
    window.parent.document.getElementsByClassName("iframes-container")[0];
  runnerContainer.setAttribute(
    "style",
    "left: 0; top: 0; width: 100%; height: 100%;"
  );

  const sizeContainer =
    window.parent.document.getElementsByClassName("size-container")[0];
  sizeContainer.setAttribute("style", "");

  const sidebar =
    window.parent.document.getElementsByClassName("reporter-wrap")[0];
  sidebar.setAttribute("style", "opacity: 0");

  const header = window.parent.document.querySelector(
    ".runner.container header"
  );
  header.setAttribute("style", "opacity: 0");
});
