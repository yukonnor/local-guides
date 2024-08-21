// instantiate next before tests are run to access env variables
import next from "next";
next({});

// process.env.NODE_ENV = "test";
require("dotenv").config({ path: ".env.local" });
import "@testing-library/jest-dom";
