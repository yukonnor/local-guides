const { defineConfig } = require("cypress");
require("dotenv").config();

// Set node env to test to use test db.
process.env.NODE_ENV = "test";

module.exports = defineConfig({
    viewportWidth: 1280,
    viewportHeight: 720,

    env: {
        DATABASE_URL: process.env.DATABASE_URL_TEST,
        user_username: "testuser",
        user_password: process.env.SEED_USER_PW,
        admin_username: "testadmin",
        admin_password: process.env.SEED_ADMIN_PW,
    },

    e2e: {
        setupNodeEvents(on, config) {
            // Merge the environment variables with Cypress config.env
            config.env = {
                ...config.env,
                user_username: process.env.USER_USERNAME || "testuser",
                user_password: process.env.SEED_USER_PW,
                admin_username: process.env.ADMIN_USERNAME || "testadmin",
                admin_password: process.env.SEED_ADMIN_PW,
            };
            return config;
        },

        baseUrl: "http://localhost:3000",
    },
});
