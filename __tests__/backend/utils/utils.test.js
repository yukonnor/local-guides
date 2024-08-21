/**
 * @jest-environment node
 */

const { AppError, BadRequestError, returnValidationError } = require("@/utils/errors");
const { sqlForPartialUpdate } = require("@/utils/sql");
import { isValidLatitude, isValidLongitude, toTitleCase } from "@/utils/helpers";
const { commonAfterAll } = require("../testCommon");

afterAll(commonAfterAll);

describe("Utils", () => {
    beforeEach(() => {
        jest.restoreAllMocks();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("errors | returnValidationError", () => {
        it("should return a JSON response with the correct structure and content", () => {
            const errors = [{ message: "Error message 1" }, { message: "Error message 2" }];
            const result = returnValidationError(errors);

            expect(result.status).toBe(400);
            expect(result.headers.get("Content-Type")).toBe("application/json");
            return result.json().then((data) => {
                expect(data).toEqual({ errors: ["Error message 1", "Error message 2"] });
            });
        });

        it("should return a JSON response with an empty error array", () => {
            const errors = [];
            const result = returnValidationError(errors);

            expect(result.status).toBe(400);
            expect(result.headers.get("Content-Type")).toBe("application/json");
            return result.json().then((data) => {
                expect(data).toEqual({ errors: [] });
            });
        });
    });

    describe("errors | AppError", () => {
        it("should create an error with default message and status", () => {
            const error = new AppError();

            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe("App Error");
            expect(error.status).toBe(500);
        });

        it("should create an error with custom message and default status", () => {
            const customMessage = "Custom error message";
            const error = new AppError(customMessage);

            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe(customMessage);
            expect(error.status).toBe(500);
        });

        it("should create an error with custom message and custom status", () => {
            const customMessage = "Custom error message";
            const customStatus = 404;
            const error = new AppError(customMessage, customStatus);

            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe(customMessage);
            expect(error.status).toBe(customStatus);
        });

        it("should handle being created with an empty message", () => {
            const error = new AppError("");

            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe("");
            expect(error.status).toBe(500);
        });
    });

    describe("helpers | isValidLatitude", () => {
        it("should return true for valid latitude within range", () => {
            expect(isValidLatitude(0)).toBe(true);
            expect(isValidLatitude(45)).toBe(true);
            expect(isValidLatitude(-45)).toBe(true);
            expect(isValidLatitude(90)).toBe(true);
            expect(isValidLatitude(-90)).toBe(true);
        });

        it("should return false for invalid latitude out of range", () => {
            expect(isValidLatitude(91)).toBe(false);
            expect(isValidLatitude(-91)).toBe(false);
            expect(isValidLatitude(180)).toBe(false);
            expect(isValidLatitude(-180)).toBe(false);
        });

        it("should return false for non-numeric input", () => {
            expect(isValidLatitude("abc")).toBe(false);
            expect(isValidLatitude("45a")).toBe(false);
            expect(isValidLatitude(null)).toBe(false);
            expect(isValidLatitude(undefined)).toBe(false);
        });

        it("should return true for numeric strings representing valid latitude", () => {
            expect(isValidLatitude("45")).toBe(true);
            expect(isValidLatitude("-45")).toBe(true);
            expect(isValidLatitude("90")).toBe(true);
            expect(isValidLatitude("-90")).toBe(true);
        });

        it("should return false for empty string", () => {
            expect(isValidLatitude("")).toBe(false);
        });
    });

    describe("helpers | isValidLongitude", () => {
        it("should return true for valid longitude within range", () => {
            expect(isValidLongitude(0)).toBe(true);
            expect(isValidLongitude(45)).toBe(true);
            expect(isValidLongitude(-45)).toBe(true);
            expect(isValidLongitude(120)).toBe(true);
            expect(isValidLongitude(-100)).toBe(true);
        });

        it("should return false for invalid longitude out of range", () => {
            expect(isValidLongitude(181)).toBe(false);
            expect(isValidLongitude(-181)).toBe(false);
        });

        it("should return false for non-numeric input", () => {
            expect(isValidLongitude("abc")).toBe(false);
            expect(isValidLongitude("45a")).toBe(false);
            expect(isValidLongitude(null)).toBe(false);
            expect(isValidLongitude(undefined)).toBe(false);
        });

        it("should return true for numeric strings representing valid longitude", () => {
            expect(isValidLongitude("45")).toBe(true);
            expect(isValidLongitude("-45")).toBe(true);
            expect(isValidLongitude("90")).toBe(true);
            expect(isValidLongitude("-90")).toBe(true);
        });

        it("should return false for empty string", () => {
            expect(isValidLongitude("")).toBe(false);
        });
    });

    describe("helpers | toTitleCase", () => {
        it("should return strings back in title case", () => {
            expect(toTitleCase("hello")).toBe("Hello");
            expect(toTitleCase("foo bar")).toBe("Foo Bar");
            expect(toTitleCase("FooBar")).toBe("Foobar");
            expect(toTitleCase(" Foo bar ")).toBe("Foo Bar");
            expect(toTitleCase(" Foo   bar ")).toBe("Foo Bar");
        });

        it("should return empty string for empty string", () => {
            expect(toTitleCase("")).toBe("");
        });

        it("should handle non-string input", () => {
            expect(() => toTitleCase(123)).toThrow(TypeError);
            expect(() => toTitleCase({})).toThrow(TypeError);
        });
    });

    describe("sql | sqlForPartialUpdate", () => {
        test("should generate correct SQL and values for normal input", () => {
            const dataToUpdate = { firstName: "Aliya", age: 32 };
            const jsToSql = { firstName: "first_name" };

            const result = sqlForPartialUpdate(dataToUpdate, jsToSql);

            expect(result).toEqual({
                setCols: '"first_name"=$1, "age"=$2',
                values: ["Aliya", 32],
            });
        });

        test("should throw BadRequestError if no data is provided", () => {
            const dataToUpdate = {};
            const jsToSql = { firstName: "first_name" };

            expect(() => sqlForPartialUpdate(dataToUpdate, jsToSql)).toThrow(BadRequestError);
        });

        test("should handle missing jsToSql mappings", () => {
            const dataToUpdate = { firstName: "Aliya", lastName: "Last", age: 32 };
            const jsToSql = { firstName: "first_name" };

            const result = sqlForPartialUpdate(dataToUpdate, jsToSql);

            expect(result).toEqual({
                setCols: '"first_name"=$1, "lastName"=$2, "age"=$3',
                values: ["Aliya", "Last", 32],
            });
        });

        test("should handle empty jsToSql object", () => {
            const dataToUpdate = { firstName: "Aliya", age: 32 };
            const jsToSql = {};

            const result = sqlForPartialUpdate(dataToUpdate, jsToSql);

            expect(result).toEqual({
                setCols: '"firstName"=$1, "age"=$2',
                values: ["Aliya", 32],
            });
        });

        test("should handle special characters in field names", () => {
            const dataToUpdate = { "first-Name": "Aliya", "user Age": 32 };
            const jsToSql = { "first-Name": "first_name", "user Age": "user_age" };

            const result = sqlForPartialUpdate(dataToUpdate, jsToSql);

            expect(result).toEqual({
                setCols: '"first_name"=$1, "user_age"=$2',
                values: ["Aliya", 32],
            });
        });

        test("should handle numeric values in jsToSql", () => {
            const dataToUpdate = { firstName: "Aliya", age: 32, height: 5.5 };
            const jsToSql = { firstName: "first_name", age: "age_years" };

            const result = sqlForPartialUpdate(dataToUpdate, jsToSql);

            expect(result).toEqual({
                setCols: '"first_name"=$1, "age_years"=$2, "height"=$3',
                values: ["Aliya", 32, 5.5],
            });
        });

        test("should handle null values in dataToUpdate", () => {
            const dataToUpdate = { firstName: "Aliya", age: null };
            const jsToSql = { firstName: "first_name" };

            const result = sqlForPartialUpdate(dataToUpdate, jsToSql);

            expect(result).toEqual({
                setCols: '"first_name"=$1, "age"=$2',
                values: ["Aliya", null],
            });
        });

        test("should handle boolean values in dataToUpdate", () => {
            const dataToUpdate = { isActive: true, isAdmin: false };
            const jsToSql = { isActive: "is_active", isAdmin: "is_admin" };

            const result = sqlForPartialUpdate(dataToUpdate, jsToSql);

            expect(result).toEqual({
                setCols: '"is_active"=$1, "is_admin"=$2',
                values: [true, false],
            });
        });
    });
});
