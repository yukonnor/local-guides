const nextJest = require("next/jest");

/** @type {import('jest').Config} */
const createJestConfig = nextJest({
    // This path should point to the root of your Next.js app
    dir: "./",
});

// Add any custom config to be passed to Jest
const config = {
    coverageProvider: "v8", // Uses V8 JavaScript engine for code coverage
    testEnvironment: "jsdom", // Suitable for testing React components

    transform: {
        "^.+\\.jsx?$": "babel-jest",
    },
    transformIgnorePatterns: ["/node_modules/(?!jose)/"],
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
        "\\.(css|less)$": "identity-obj-proxy",
    },

    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"], // Setup files to run after the environment is set up
    testMatch: ["<rootDir>/__tests__/frontend/**/*.test.js"], // Only run frontend tests
};

// Create and export the Jest configuration
module.exports = createJestConfig(config);
