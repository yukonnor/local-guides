// can view private guides if logged in and shared with

// can view private guides if admin

describe("Guide View", () => {
    it("can view public guides while logged out", () => {
        cy.visit("/guides/1");
        cy.contains("h1", "Test Guide: San Francisco California").should("be.visible");
        cy.contains("About This Guide").should("be.visible");

        // can sort and filter
        cy.get(".GuidePlace").first().contains("Zeitgeist");
        cy.get(".sort-and-filter").contains("Rating").click();
        cy.get(".GuidePlace").first().contains("Yosemite National Park");
        cy.get(".sort-and-filter").get("select").select("Family");
        cy.contains("Zeitgeist").should("be.visible");
        cy.contains("Yosemite National Park").should("not.exist");

        // can jump to google page
        cy.get(".google-maps-link")
            .first()
            .should("be.visible")
            .should("have.attr", "href")
            .and("include", "google.com");

        // Should not be able to do stuff that only guide owner can do
        cy.contains("Manage Your Guide").should("not.exist");

        cy.visit("/guides/1/edit");
        cy.url().should("eq", "http://localhost:3000/auth/login?alert=not-authorized");
        cy.contains("🔒 You need to be logged in to view that page.").should("be.visible");

        cy.visit("/guides/1/delete");
        cy.url().should("eq", "http://localhost:3000/auth/login?alert=not-authorized");
        cy.contains("🔒 You need to be logged in to view that page.").should("be.visible");
    });

    it("can view private guides if shared with", () => {
        // Should not let logged out users view private guides
        cy.visit("/guides/2");
        cy.url().should("eq", "http://localhost:3000/?alert=not-authorized-guide");
        cy.contains("🔒 Unable to view that guide.").should("be.visible");

        // it should show private guides if logged in and shared with
        const user = {
            username: "testviewer",
            password: Cypress.env("user_password"),
        };

        cy.loginViaUi(user);

        cy.visit("/guides/2");
        cy.contains("h1", "Private Guide: San Francisco California").should("be.visible");
        cy.contains("About This Guide").should("be.visible");

        // Should not be able to do stuff that only guide owner can do
        cy.contains("Manage Your Guide").should("not.exist");
        cy.visit("/guides/2/edit");
        cy.url().should("eq", "http://localhost:3000/?alert=not-authorized-guide");
        cy.contains("🔒 Unable to view that guide.").should("be.visible");

        cy.visit("/guides/2/delete");
        cy.url().should("eq", "http://localhost:3000/?alert=not-authorized-guide");
        cy.contains("🔒 Unable to view that guide.").should("be.visible");
    });

    it("can view and edit private guides if admin", () => {
        // it should show private guides if logged in and admin
        const user = {
            username: "testadmin",
            password: Cypress.env("admin_password"),
        };

        cy.loginViaUi(user);

        cy.visit("/guides/2");
        cy.contains("h1", "Private Guide: San Francisco California").should("be.visible");
        cy.contains("About This Guide").should("be.visible");

        // Should be able to edit guide
        cy.contains("Manage Your Guide").should("be.visible");
        cy.visit("/guides/2/edit");
        cy.url().should("eq", "http://localhost:3000/guides/2/edit");
        cy.contains("h5", "Edit Your Guide").should("be.visible");

        cy.visit("/guides/2/delete");
        cy.url().should("eq", "http://localhost:3000/guides/2/delete");
        cy.contains("h5", "Delete Your Guide?").should("be.visible");
    });
});
