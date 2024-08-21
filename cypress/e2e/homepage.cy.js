describe("Homepage", () => {
    it("should load the homepage", () => {
        cy.visit("/");
        cy.contains("local guides").should("be.visible");
        cy.contains("Search For a City to Find Guides").should("be.visible");
    });

    it("should navigate to the find guides page and navigate back home", () => {
        cy.visit("/"); // Ensure we visit the page before trying to interact with it
        cy.contains("Find Guides").should("be.visible").click();
        cy.url().should("include", "/guides");
        cy.contains("Find Guides").should("be.visible");

        cy.contains("local guides").should("be.visible").click();
        cy.url().should("eq", "http://localhost:3000/");
    });

    it("should navigate to the guide create page", () => {
        cy.visit("/");
        cy.contains("Create a Guide").should("be.visible").click();
        cy.url().should("include", "/guides/create");
        cy.contains("Create a Guide").should("be.visible");
    });

    it("should show locality search results and navigate to the guide results page", () => {
        // from the home page, enter a search and click the search result
        cy.visit("/");
        cy.get("#search").type("portland me");
        cy.get("button").contains("Search").should("be.visible").click();
        cy.contains("Select a City:").should("be.visible");
        cy.contains("Portland, ME, USA").should("be.visible").click();

        // we should now be on a guide results page
        cy.url().should("eq", "http://localhost:3000/guides?gpid=ChIJLe6wqnKcskwRKfpyM7W2nX4");
        cy.contains("h1", "Portland");
        cy.get(".OuterCard").contains("Guides Near Portland").should("be.visible");

        // we should be able to change our search location from the guide results page
        cy.contains("Search somewhere else?").should("be.visible").click();
        cy.get(".modal-content").contains("Update Location Search").should("be.visible");
        cy.get(".modal-content").find("#search").type("san francisco");
        cy.get(".modal-content").contains("button", "Search").should("be.visible").click();
        cy.contains("Select a City:").should("be.visible");
        cy.contains("San Francisco, CA, USA").should("be.visible").click();
        cy.contains("h1", "San Francisco");
    });
});
