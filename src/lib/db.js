"use strict";

/** Database setup for local-guides. */
const { Client } = require("pg");
const { getDatabaseUri } = require("../config/config");

let db;

if (process.env.NODE_ENV === "production") {
    db = new Client({
        connectionString: getDatabaseUri(),
        ssl: {
            rejectUnauthorized: false,
        },
    });
} else {
    db = new Client({
        connectionString: getDatabaseUri(),
    });
}

db.connect().catch((err) => console.error("Database connection error", err.stack));

module.exports = db;
