describe("Profile", () => {
    it("should redirect to login if logged out", () => {
        cy.visit("/profile");
        cy.url().should("eq", "http://localhost:3000/auth/login?alert=not-authorized");
        cy.contains("Log In").should("be.visible");

        cy.visit("/profile/1");
        cy.url().should("eq", "http://localhost:3000/auth/login?alert=not-authorized");
        cy.contains("Log In").should("be.visible");
    });

    it("should allow user to visit if logged in", () => {
        const user = {
            id: 1,
            username: Cypress.env("user_username"),
            password: Cypress.env("user_password"),
        };

        cy.loginViaUi(user);

        // Navbar should show profile link that links to profile
        cy.visit("/");
        cy.contains(`Hello, ${user.username}!`).should("be.visible").click();

        // Profile page should have these details
        cy.url().should("eq", `http://localhost:3000/profile/${user.id}`);
        cy.contains("h1", `${user.username}`).should("be.visible");
        cy.contains("Your Information").should("be.visible");
        cy.contains("Your Guides").should("be.visible");
        cy.contains("Guides Shared With You").should("be.visible");
        cy.contains("Danger Zone").should("be.visible");

        // User should see their guides and can navigate to them
        cy.contains("Test Guide: San Francisco California").should("be.visible");
        cy.contains("Private Guide: San Francisco California").should("be.visible").click();
        cy.url().should("eq", "http://localhost:3000/guides/2");
        cy.contains("h1", "Private Guide: San Francisco California").should("be.visible");

        // Going to /profile should redirect to your profile page
        cy.visit("/profile");
        cy.url().should("eq", `http://localhost:3000/profile/${user.id}`);
    });

    it("should support editing the user's profile", () => {
        const user = {
            id: 1,
            username: Cypress.env("user_username"),
            password: Cypress.env("user_password"),
        };

        cy.loginViaUi(user);

        // Navigate to Edit form
        cy.visit(`/profile/${user.id}`);
        cy.contains(".btn-primary", "Edit").click(); // navigate to Edit Profile form

        // Edit profile
        cy.contains("h5", "Edit Profile").should("be.visible");
        cy.get("#email").clear().type("new@localguides.com");
        cy.get("#username").clear().type("newusername");
        cy.get('button[type="submit"]').click();
        cy.contains("Editing...").should("be.visible");
        cy.wait(1000);

        // Verify edit successful
        cy.url().should("eq", `http://localhost:3000/profile/${user.id}`);
        cy.contains("h1", "newusername").should("be.visible");
        cy.contains("new@localguides.com").should("be.visible");

        // Edit back to original
        cy.contains(".btn-primary", "Edit").click();
        cy.get("#email").clear().type(`${user.username}@localguides.com`);
        cy.get("#username").clear().type(`${user.username}`);
        cy.get('button[type="submit"]').click();
        cy.wait(1000);
    });

    // any profile should be visible by admin
    it("should allow admins to view any user profile", () => {
        const admin = {
            id: 2,
            username: Cypress.env("admin_username"),
            password: Cypress.env("admin_password"),
        };

        cy.loginViaUi(admin);

        // Go to other user's profile
        cy.visit("/profile/1");
        cy.url().should("eq", "http://localhost:3000/profile/1");
        cy.contains(".btn-primary", "Edit").click();
        cy.url().should("eq", "http://localhost:3000/profile/1/edit");
    });

    it("should allow user to view and navigated to guides shared with them", () => {
        const user = {
            id: 3,
            username: "testviewer",
            password: Cypress.env("user_password"),
        };

        cy.loginViaUi(user);

        // Navbar should show profile link that links to profile
        cy.visit("/");
        cy.contains(`Hello, ${user.username}!`).should("be.visible").click();

        // User should see guides shared with them and can navigate to them
        cy.contains("Guides Shared With You").should("be.visible");
        cy.contains("Private Guide: San Francisco California").should("be.visible").click();
        cy.url().should("eq", "http://localhost:3000/guides/2");
        cy.contains("h1", "Private Guide: San Francisco California").should("be.visible");
        cy.contains("h5", "Manage Your Guide").should("not.exist");
    });

    it("should support registering and deleting a profile", () => {
        const user = {
            email: "new@localguides.com",
            username: "cypress_tester",
            password: "password",
        };

        cy.registerViaUi(user);

        // Navigate to Profile & Delete form
        cy.visit("/");
        cy.contains(`Hello, ${user.username}!`).should("be.visible").click();
        cy.contains(".btn-outline-danger", "Delete Account").click();

        // Delete profile navigate back and forth
        cy.contains("< Go Back").click();
        cy.contains("h1", `${user.username}`).should("be.visible");
        cy.contains(".btn-outline-danger", "Delete Account").click();

        // Submidt delete profile form
        cy.contains("h5", "Delete your profile?").should("be.visible");
        cy.contains(".btn-danger", "Delete Profile").should("be.visible");
        cy.get('button[type="submit"]').click();
        cy.contains("Deleting...").should("be.visible");
        cy.wait(1000);

        // Verify logged out
        cy.url().should("eq", "http://localhost:3000/");
        cy.contains("Log In").should("be.visible");
        cy.visit("/profile");
        cy.url().should("eq", "http://localhost:3000/auth/login?alert=not-authorized");
        cy.contains("Log In").should("be.visible");
    });
});
