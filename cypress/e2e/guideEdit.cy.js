describe("Guide Search", () => {
    let guideUrl;

    it("should first create a guide", () => {
        const user = {
            id: 1,
            username: "testuser",
            password: Cypress.env("user_password"),
        };

        cy.loginViaUi(user);
        cy.visit("/guides/create");
        cy.get("#search").type("San Francisco");
        cy.get('button[type="submit"]').click();
        cy.contains("San Francisco, CA, USA").should("be.visible").click();

        // submit after inputting title
        cy.get("#title").type("San Francisco Cypress Guide");
        cy.get('button[type="submit"]').click();
        cy.wait(2000);

        // After the redirect, capture the current URL
        cy.url().then((url) => {
            // Regular expression to match the format: http://localhost:3000/guides/{number}
            const regex = /^http:\/\/localhost:3000\/guides\/\d+$/;

            // Assert that the URL matches the expected format
            expect(url).to.match(regex);
            // Store the current URL in a variable
            guideUrl = url;
        });
    });

    it("can edit the guide details", () => {
        const user = {
            username: "testuser",
            password: Cypress.env("user_password"),
        };

        cy.loginViaUi(user);
        cy.visit(guideUrl);

        // Check guide has correct initial values
        cy.contains("h1", "San Francisco Cypress Guide").should("be.visible");
        cy.contains(
            "Your guide is Private. Only users you share your guide with can see your guide."
        ).should("be.visible");
        cy.contains("Add a description for your guide").should("be.visible");

        // Edit guide
        cy.contains(".btn-outline-primary", "Edit Guide").click();
        cy.contains("h5", "Edit Your Guide").should("be.visible");

        // validate form
        cy.get("#title").clear();
        cy.get('button[type="submit"]').click();
        cy.contains("Provide a title for your guide.").should("be.visible");

        // submit form
        cy.get("#title").clear().type("Edited San Francisco Cypress Guide");
        cy.get("#description").clear().type("Test Desciption");
        cy.get("#isPrivate").click();
        cy.get('button[type="submit"]').click();
        cy.contains("Editing...").should("be.visible");
        cy.wait(250);

        // should redirect back to guide page and see edits
        cy.url().should("eq", guideUrl);
        cy.contains("h1", "Edited San Francisco Cypress Guide").should("be.visible");
        cy.contains(
            "Your Guide is Public. Your guide shows up in search results and can be seen by anyone."
        ).should("be.visible");
        cy.contains("Test Desciption").should("be.visible");
    });

    // it("can manange guide shares", () => {
    //     const user = {
    //         username: "testuser",
    //         password: Cypress.env("user_password"),
    //     };

    //     cy.loginViaUi(user);
    //     cy.visit(guideUrl);

    //     // Share guide
    //     cy.contains(".btn-outline-primary", "Share Guide").click();
    //     cy.contains("h5", "Share Your Guide?").should("be.visible");

    //     // validate form
    //     cy.get("#email").clear();
    //     cy.get('button[type="submit"]').click();
    //     cy.contains("Please provide an email address to share guide.").should("be.visible");

    //     // submit form
    //     cy.get("#email").clear().type("test@example.com");
    //     cy.get('button[type="submit"]').click();
    //     cy.wait(250);

    //     // should see email in Your Guide is Shared With section
    //     cy.get("li").contains("test@example.com").should("be.visible");

    //     // should delete shared email
    //     cy.contains(".btn-outline-danger", "Remove Share").click();
    //     cy.contains("test@example.com").should("not.exist");

    //     // should navigate back to guide page
    //     cy.contains(".nav-link", "< Go Back").click();
    //     cy.url().should("eq", guideUrl);
    // });

    // it("can add a place to the guide", () => {
    //     const user = {
    //         username: "testuser",
    //         password: Cypress.env("user_password"),
    //     };

    //     cy.loginViaUi(user);
    //     cy.visit(guideUrl);

    //     // Add place
    //     cy.contains(".btn-primary", "Add Place").click();
    //     cy.contains("h5", "Add a place to your guide").should("be.visible");

    //     // validate form
    //     cy.get("#placeSearch").clear();
    //     cy.get('button[type="submit"]').click();
    //     cy.contains("Please enter a search term.").should("be.visible");

    //     // submit form
    //     cy.get("#placeSearch").clear().type("SCRAP");
    //     cy.get('button[type="submit"]').click();
    //     cy.wait(250);

    //     // should see a place result
    //     cy.contains("Select a place to add:").should("be.visible");
    //     cy.get("li").contains("SCRAP").should("be.visible").click();

    //     // should now be on place details form
    //     cy.contains("h5", "SCRAP").should("be.visible");
    //     cy.get("#description").clear().type("This is a neat place.");
    //     cy.get("#dontmiss").check();
    //     cy.get('button[type="submit"]').click();
    //     cy.contains("Adding...").should("be.visible");

    //     // should redirect back to guide page
    //     cy.url().should("eq", guideUrl);
    //     cy.contains("h5", "SCRAP").should("be.visible");
    //     cy.contains(".RecTag", "Don't Miss It!").should("be.visible");
    // });

    // it("can edit a place on the guide", () => {
    //     const user = {
    //         username: "testuser",
    //         password: Cypress.env("user_password"),
    //     };

    //     cy.loginViaUi(user);
    //     cy.visit(guideUrl);
    //     cy.wait(250);

    //     // Edit place
    //     cy.contains(".btn-small", "Edit").click();
    //     cy.wait(250);
    //     cy.contains(".modal-title", "SCRAP").should("be.visible");

    //     // Can close modal w/o editing
    //     cy.get(".btn-close").click();
    //     cy.wait(250);
    //     cy.contains(".modal-title", "SCRAP").should("not.exist");

    //     // Can edit the place
    //     cy.contains(".btn-small", "Edit").click();
    //     cy.wait(250);
    //     cy.get("#description").clear().type("Edited place description.");
    //     cy.get("#iftime").check();

    //     // should see place tag suggestions and should add tag
    //     cy.get(".react-tags__combobox-input").click();
    //     cy.get(".react-tags__listbox").should("be.visible");
    //     cy.get(".react-tags__combobox-input").type("Art");
    //     cy.get(".react-tags__listbox").contains("Nature").should("not.exist");
    //     cy.get(".react-tags__listbox").contains("Art").click();
    //     cy.wait(250);
    //     cy.get(".react-tags__listbox").should("not.exist");
    //     cy.contains(".react-tags__tag-name", "Art");
    //     cy.get('button[type="submit"]').click();
    //     cy.wait(250);

    //     // Modal should have closed and should see edits on guide details page
    //     cy.contains(".modal-title", "SCRAP").should("not.exist");
    //     cy.contains("If You Have Time").should("be.visible");
    //     cy.contains("Edited place description.").should("be.visible");
    //     cy.contains(".PlaceTag", "Art").should("be.visible");

    //     // Should be able to delete place
    //     cy.contains(".btn-small", "Delete").click();
    //     cy.contains(".modal-title", "SCRAP").should("be.visible");
    //     cy.contains(
    //         "Want to remove this place from your guide? Careful. This can't be undone."
    //     ).should("be.visible");
    //     cy.get('button[type="submit"]').click();
    //     cy.wait(250);

    //     // Place should not exist
    //     cy.contains("h5", "SCRAP").should("not.exist");
    //     cy.contains("Let's add some places to your guide!").should("be.visible");
    // });

    it("should delete the guide that was being tested", () => {
        const user = {
            id: 1,
            username: "testuser",
            password: Cypress.env("user_password"),
        };

        cy.loginViaUi(user);
        cy.visit(guideUrl);

        cy.contains(".btn-outline-danger", "Delete Guide").click();
        cy.wait(500);
        cy.get('button[type="submit"]').click();
        cy.wait(500);
        cy.contains("Successfully deleted guide.").should("be.visible");
    });
});
