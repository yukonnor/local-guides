describe("NavBar", () => {
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

    it("it should navigate to the sign up page if logged out, ", () => {
        cy.visit("/");
        cy.contains("Sign Up").should("be.visible").click();
        cy.url().should("include", "/auth/register");
        cy.get(".OuterCard").contains("Sign Up").should("be.visible");
    });

    it("it should navigate to the log in page if logged out, ", () => {
        cy.visit("/");
        cy.contains("Log In").should("be.visible").click();
        cy.url().should("include", "/auth/login");
        cy.get(".OuterCard").contains("Log In").should("be.visible");
    });

    it("it should show a collapsed view on small screens", () => {
        cy.visit("/");
        cy.viewport("iphone-6"); // Set viewport to 375px x 667px
        cy.contains("Find Guides").should("not.be.visible");
        cy.contains("Create a Guide").should("not.be.visible");
        cy.contains("Log In").should("not.be.visible");
        cy.contains("Sign Up").should("not.be.visible");

        // expand to view navigation items
        cy.get(".navbar-toggler").click();
        cy.contains("Find Guides").should("be.visible");
        cy.contains("Create a Guide").should("be.visible");
        cy.contains("Log In").should("be.visible");
        cy.contains("Sign Up").should("be.visible");
    });
});
