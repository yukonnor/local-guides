// // jest.backend.config.js
const nextJest = require("next/jest");
const dotenv = require("dotenv");
const createJestConfig = nextJest({
    dir: "./",
});

dotenv.config({ path: ".env.local" });

// Add any custom config to be passed to Jest
const customJestConfig = {
    moduleDirectories: ["node_modules", __dirname],
    testEnvironment: "node",
    setupFilesAfterEnv: ["./jest.setup.js"],
    setupFiles: ["<rootDir>/__tests__/backend/testCommon.js"], // Setup file for database seeding and transactions
    testMatch: ["<rootDir>/__tests__/backend/**/*.test.js"], // Only run backend tests
    testPathIgnorePatterns: [
        "/node_modules/",
        "/__tests__/backend/testCommon.js",
        "/__tests__/frontend/",
    ], // Exclude testCommon.js and frontend tests
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
    }, // Tell jest that "@" means /src
};

module.exports = createJestConfig(customJestConfig);
