describe("Guide Search", () => {
    it("should display a random guide before a location is selected", () => {
        cy.visit("/guides");
        cy.contains("See a random guide:").should("be.visible");
        cy.get(".btn-primary").contains("Get Random Guide").click();
        cy.contains("Loading...").should("be.visible");

        cy.wait(1000);
        cy.contains("About This Guide").should("be.visible");
    });

    it("should handle locality searches", () => {
        cy.visit("/");

        // it should show error toast if no search term provided
        cy.get('button[type="submit"]').click();
        cy.contains("Please enter a search term.").should("be.visible");

        // it should show error toast if no locality found
        cy.get("#search").type("asdkljasdfkljasdf");
        cy.get('button[type="submit"]').click();
        cy.contains("Couldn't find that city. Try new search or try again later.").should(
            "be.visible"
        );

        // Try performing a locality search and go through flow to a guide page
        cy.get("#search").clear().type("San Francisco");
        cy.get('button[type="submit"]').click();
        cy.contains("Select a City:").should("be.visible");
        cy.contains("San Francisco, CA, USA").should("be.visible").click();

        cy.url().should("eq", "http://localhost:3000/guides?gpid=ChIJIQBpAG2ahYAR_6128GcTUEo");
        cy.getCookie("locality").should("exist");
        cy.contains("Guides Near San Francisco").should("be.visible");
        cy.contains("Test Guide: San Francisco California").should("be.visible").click();

        cy.contains("Loading...").should("be.visible");
        cy.wait(500);

        cy.contains("Test Guide: San Francisco California").should("be.visible");
        cy.contains("About This Guide").should("be.visible");
    });

    it("should show guide results for locality set in cookie", () => {
        // Set locality cookie to San Francisco
        cy.setCookie(
            "locality",
            "%7B%22id%22%3A%22ChIJIQBpAG2ahYAR_6128GcTUEo%22%2C%22formattedAddress%22%3A%22San%20Francisco%2C%20CA%2C%20USA%22%2C%22location%22%3A%7B%22latitude%22%3A37.7749295%2C%22longitude%22%3A-122.41941550000001%7D%2C%22googleMapsUri%22%3A%22https%3A%2F%2Fmaps.google.com%2F%3Fcid%3D5354801294080388607%22%2C%22displayName%22%3A%7B%22text%22%3A%22San%20Francisco%22%7D%7D"
        );

        cy.visit("/guides");
        cy.contains("Guides Near San Francisco").should("be.visible");
    });

    it("should show appropriate guide results", () => {
        // Set locality cookie to San Francisco
        cy.setCookie(
            "locality",
            "%7B%22id%22%3A%22ChIJIQBpAG2ahYAR_6128GcTUEo%22%2C%22formattedAddress%22%3A%22San%20Francisco%2C%20CA%2C%20USA%22%2C%22location%22%3A%7B%22latitude%22%3A37.7749295%2C%22longitude%22%3A-122.41941550000001%7D%2C%22googleMapsUri%22%3A%22https%3A%2F%2Fmaps.google.com%2F%3Fcid%3D5354801294080388607%22%2C%22displayName%22%3A%7B%22text%22%3A%22San%20Francisco%22%7D%7D"
        );

        // it shouldn't show private guides if logged out
        cy.visit("/guides");
        cy.contains("Test Guide: San Francisco California").should("be.visible");
        cy.contains("Private Guide: San Francisco California").should("not.exist");

        // it should show private guides if logged in and shared with
        const user = {
            username: "testviewer",
            password: Cypress.env("user_password"),
        };

        cy.loginViaUi(user);
        cy.visit("/guides");
        cy.contains("Test Guide: San Francisco California").should("be.visible");
        cy.contains("Private Guide: San Francisco California").should("be.visible");
        cy.get(".PlaceTag").contains("Private").should("be.visible");
    });

    it("should let user change search location", () => {
        // Set locality cookie to San Francisco
        cy.setCookie(
            "locality",
            "%7B%22id%22%3A%22ChIJIQBpAG2ahYAR_6128GcTUEo%22%2C%22formattedAddress%22%3A%22San%20Francisco%2C%20CA%2C%20USA%22%2C%22location%22%3A%7B%22latitude%22%3A37.7749295%2C%22longitude%22%3A-122.41941550000001%7D%2C%22googleMapsUri%22%3A%22https%3A%2F%2Fmaps.google.com%2F%3Fcid%3D5354801294080388607%22%2C%22displayName%22%3A%7B%22text%22%3A%22San%20Francisco%22%7D%7D"
        );

        // it let user change location
        cy.visit("/guides");
        cy.contains("Search somewhere else?").click();
        cy.wait(500);

        // first try an error
        cy.get(".modal").get("#search").type("Bouvet Island");
        cy.get(".modal").get('button[type="submit"]').click();
        cy.contains("Couldn't find that city. Try new search or try again later.").should(
            "be.visible"
        );

        // then, enter real place
        cy.get(".modal").get("#search").clear().type("Potwin KS");
        cy.get(".modal").get('button[type="submit"]').click();
        cy.contains("Potwin, KS 67123, USA").click();

        cy.url().should("eq", "http://localhost:3000/guides?gpid=ChIJ1SuDXh2mu4cRrBNcUVSWpAw");
        cy.getCookie("locality").should("exist");
        cy.contains("Guides Near Potwin").should("be.visible");

        // it shouldn't show guides if no guides found
        cy.contains(
            "No guides gound near Potwin, KS 67123, USA. Search for a new location or create a new guide for this location!"
        ).should("be.visible");
    });

    it("should let user navigate to create guide form", () => {
        // Set locality cookie to San Francisco
        cy.setCookie(
            "locality",
            "%7B%22id%22%3A%22ChIJIQBpAG2ahYAR_6128GcTUEo%22%2C%22formattedAddress%22%3A%22San%20Francisco%2C%20CA%2C%20USA%22%2C%22location%22%3A%7B%22latitude%22%3A37.7749295%2C%22longitude%22%3A-122.41941550000001%7D%2C%22googleMapsUri%22%3A%22https%3A%2F%2Fmaps.google.com%2F%3Fcid%3D5354801294080388607%22%2C%22displayName%22%3A%7B%22text%22%3A%22San%20Francisco%22%7D%7D"
        );

        // it shouldn't let me create a guide if logged out
        cy.visit("/guides");
        cy.contains("Create San Francisco Guide").click();
        cy.contains("🔒 You need to be logged in to view that page.").should("be.visible");

        // it should let me create after I log in
        const user = {
            username: "testuser",
            password: Cypress.env("user_password"),
        };

        cy.loginViaUi(user);
        cy.visit("/guides");
        cy.contains("Create San Francisco Guide").click();
        cy.contains("Let's create a guide for San Francisco").should("be.visible");
        cy.get("#title").type("San Francisco Cypress Guide");
        cy.get('button[type="submit"]').click();
        cy.wait(500);

        cy.contains("h1", "San Francisco Cypress Guide").should("be.visible");
        cy.contains(".btn-outline-danger", "Delete Guide").click();
        cy.contains("Delete Your Guide?").should("be.visible");
        cy.get('button[type="submit"]').click();
        cy.contains("Deleting...").should("be.visible");
        cy.wait(500);
        cy.contains("Successfully deleted guide.").should("be.visible");
    });
});
