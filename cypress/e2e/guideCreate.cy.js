describe("Guide Search", () => {
    it("should handle Create a Guide flow", () => {
        cy.visit("/guides/create");
        cy.contains("h1", "Create a Guide").should("be.visible");
        cy.contains("h5", "Search For a City to Create a Guide").should("be.visible");

        // it should show error toast if no search term provided
        cy.get('button[type="submit"]').click();
        cy.contains("Please enter a search term.").should("be.visible");

        // it should show error toast if no locality found
        cy.get("#search").type("asdkljasdfkljasdf");
        cy.get('button[type="submit"]').click();
        cy.contains("Couldn't find that city. Try new search or try again later.").should(
            "be.visible"
        );

        // Try performing a locality search and go through guide create flow
        cy.get("#search").clear().type("San Francisco");
        cy.get('button[type="submit"]').click();
        cy.contains("Select a City:").should("be.visible");
        cy.contains("San Francisco, CA, USA").should("be.visible").click();

        // Show error if user is logged out:
        cy.contains("🔒 You need to be logged in to view that page.").should("be.visible");

        // it should let me create a guide after I log in
        const user = {
            id: 1,
            username: "testuser",
            password: Cypress.env("user_password"),
        };

        cy.loginViaUi(user);
        cy.visit("/guides/create");
        cy.get("#search").clear().type("San Francisco");
        cy.get('button[type="submit"]').click();
        cy.contains("Select a City:").should("be.visible");
        cy.contains("San Francisco, CA, USA").should("be.visible").click();

        // Now on the create guide form
        cy.url().should("eq", "http://localhost:3000/guides/new?gpid=ChIJIQBpAG2ahYAR_6128GcTUEo");
        cy.contains("Let's create a guide for San Francisco").should("be.visible");

        // submit without entering title
        cy.get('button[type="submit"]').click();
        cy.wait(500);
        cy.contains("Provide a title for your guide.").should("be.visible");

        // submit after inputting title
        cy.get("#title").type("San Francisco Cypress Guide");
        cy.get('button[type="submit"]').click();
        cy.wait(500);

        // visit guide page and delete guide
        cy.contains("h1", "San Francisco Cypress Guide").should("be.visible");
        cy.contains(".btn-outline-danger", "Delete Guide").click();
        cy.contains("Delete Your Guide?").should("be.visible");
        cy.get('button[type="submit"]').click();
        cy.contains("Deleting...").should("be.visible");
        cy.wait(500);
        cy.contains("Successfully deleted guide.").should("be.visible");
    });
});
