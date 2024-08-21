describe("Auth", () => {
    it("should login redirect home if already logged in", () => {
        const user = {
            id: 1,
            username: Cypress.env("user_username"),
            password: Cypress.env("user_password"),
        };

        cy.loginViaUi(user);

        // Should redirect and show alert if I attempt to access auth pages
        cy.visit("/auth/login");
        cy.url().should("eq", "http://localhost:3000/?alert=already-logged-in");
        cy.contains("You're already logged in :)").should("be.visible");
        cy.visit("/auth/register");
        cy.url().should("eq", "http://localhost:3000/?alert=already-logged-in");
        cy.contains("You're already logged in :)").should("be.visible");
    });

    it("should show invalid username/pw toast on login form", () => {
        // if input fields empty
        cy.visit("/auth/login");
        cy.get('button[type="submit"]').click();
        cy.contains("Logging in...").should("be.visible");
        cy.wait(250);

        // Toast should appear and disappear
        cy.contains("Username or password incorrect.").should("be.visible");
        cy.wait(3000);
        cy.contains("Username or password incorrect.").should("not.be.visible");

        // if password is incorrect
        cy.get("#username").type("testuser");
        cy.get("#password").type("foobar");
        cy.get('button[type="submit"]').click();
        cy.contains("Logging in...").should("be.visible");
        cy.wait(250);

        // Toast should appear
        cy.contains("Username or password incorrect.").should("be.visible");
    });

    it("should show invalid input toasts on register form", () => {
        // if input fields empty
        cy.visit("/auth/register");
        cy.get('button[type="submit"]').click();
        cy.contains("Signing up...").should("be.visible");
        cy.wait(250);

        // Toast should appear and disappear
        cy.contains("Can't register user. Username must be at least 1 character long.").should(
            "be.visible"
        );
        cy.wait(3000);
        cy.contains("Can't register user. Username must be at least 1 character long.").should(
            "not.be.visible"
        );

        // if username only input
        cy.get("#username").clear().type("test");
        cy.get('button[type="submit"]').click();
        cy.contains("Signing up...").should("be.visible");
        cy.wait(250);

        // Toast should appear
        cy.contains("Can't register user. Password must be at least 8 characters long.").should(
            "be.visible"
        );

        // if username and short password
        cy.get("#username").clear().type("test");
        cy.get("#password").clear().type("foobar");
        cy.get('button[type="submit"]').click();
        cy.contains("Signing up...").should("be.visible");
        cy.wait(250);

        // Toast should appear
        cy.contains("Can't register user. Password must be at least 8 characters long.").should(
            "be.visible"
        );

        // if username and password, no email
        cy.get("#username").clear().type("test");
        cy.get("#password").clear().type("foobar1234");
        cy.get('button[type="submit"]').click();
        cy.contains("Signing up...").should("be.visible");
        cy.wait(250);

        // Toast should appear
        cy.contains("Can't register user. Please provide an email address.").should("be.visible");

        // if username and password, invalid email
        cy.get("#email").type("a");
        cy.get("#username").clear().type("test");
        cy.get("#password").clear().type("foobar1234");
        cy.get('button[type="submit"]').click();
        cy.contains("Signing up...").should("not.exist");

        // Browser validation should appear
        cy.get("#email:invalid").should("be.visible");
    });

    it("should support registering", () => {
        const user = {
            email: "new@localguides.com",
            username: "cypress_tester",
            password: "password",
        };

        cy.registerViaUi(user);

        // Navigate to Profile & Delete form
        cy.contains(`Hello, ${user.username}!`).should("be.visible");
        cy.contains(`Welcome to Local Guides, ${user.username}!`).should("be.visible");
    });

    it("should delete the the test user account to clean up tests", () => {
        const user = {
            username: "cypress_tester",
            password: "password",
        };

        cy.loginViaUi(user);

        // Navigate to Profile & Delete form
        cy.contains(`Hello, ${user.username}!`).should("be.visible").click();
        cy.contains(".btn-outline-danger", "Delete Account").click();
        cy.get('button[type="submit"]').click();
        cy.wait(1000);

        // Verify delete successful out
        cy.url().should("eq", "http://localhost:3000/");
        cy.contains("Log In").should("be.visible");
    });
});
