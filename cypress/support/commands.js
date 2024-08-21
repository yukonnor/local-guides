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
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add("loginViaUi", (user) => {
    cy.visit("/auth/login");
    cy.get("#username").type(user.username);
    cy.get("#password").type(user.password, { log: false });
    cy.get('button[type="submit"]').click();
    cy.contains("Logging in...").should("be.visible");
    cy.wait(500);

    cy.contains(`Hello, ${user.username}!`).should("be.visible");
    cy.getCookie("session").should("exist");
    cy.wait(500);
});

Cypress.Commands.add("registerViaUi", (user) => {
    cy.visit("/auth/register");
    cy.get("#email").type(user.email);
    cy.get("#username").type(user.username);
    cy.get("#password").type(user.password, { log: false });
    cy.get('button[type="submit"]').click();
    cy.contains("Signing up...").should("be.visible");
    cy.wait(1000);
    cy.contains(`Hello, ${user.username}!`).should("be.visible");
    cy.getCookie("session").should("exist");
});

// Cypress configuration to handle uncaught exceptions related to NEXT_REDIRECT
Cypress.on("uncaught:exception", (err) => {
    // Check if the error message includes "NEXT_REDIRECT"
    // This block is added to handle server-side redirects in Next.js.
    // When these redirects occur, they can throw a "NEXT_REDIRECT" error,
    // which is expected behavior and should not cause the test to fail.
    if (err.message.includes("NEXT_REDIRECT")) {
        return false;
    }
});
