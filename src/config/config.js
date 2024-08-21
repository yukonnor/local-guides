"use strict";

/** Shared config for application; can be required many places. */

require("dotenv").config();
require("colors");

const SECRET_KEY = process.env.SECRET_KEY;
const PORT = +process.env.PORT || 3001;
const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 13;

// Use dev database, testing database, or via env var, production database
function getDatabaseUri() {
    return process.env.NODE_ENV === "test" || process.env.NODE_ENV === "development"
        ? process.env.DATABASE_URL_TEST
        : process.env.DATABASE_URL;
}

console.log("Local Guides Config:".green);
console.log("NODE_ENV:".yellow, process.env.NODE_ENV);
console.log("PORT:".yellow, PORT.toString());
// console.log("BCRYPT_WORK_FACTOR".yellow, BCRYPT_WORK_FACTOR);
console.log("Database:".yellow, getDatabaseUri());
console.log("---");

module.exports = {
    SECRET_KEY,
    PORT,
    BCRYPT_WORK_FACTOR,
    getDatabaseUri,
};
