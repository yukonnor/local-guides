/**
 * @jest-environment node
 */

import { signJWT, verifyJWT, login, logout } from "@/lib/authHandler";
import { setSession, destroySesion } from "@/lib/sessionHandler";
import fetch from "node-fetch";
const { Response } = jest.requireActual("node-fetch");
const { commonAfterAll } = require("../testCommon");

// Mock the fetch function
jest.mock("node-fetch", () => jest.fn());

// Mock the sessionHandler module
jest.mock("@/lib/sessionHandler", () => ({
    setSession: jest.fn(),
    destroySesion: jest.fn(),
}));

afterAll(commonAfterAll);

describe("authHandler", () => {
    beforeEach(() => {
        jest.restoreAllMocks();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("signJWT", () => {
        it("should generate a valid JWT token", async () => {
            const SECRET = process.env.JWT_SECRET;
            const payload = { userId: 123 };
            const token = await signJWT(payload, SECRET);

            expect(typeof token).toBe("string");
            expect(token.split(".")).toHaveLength(3); // JWT tokens have 3 parts (header, payload, signature)
        });

        it("should throw an error if JWT_SECRET is missing", async () => {
            const SECRET = undefined;
            const payload = { userId: 123 };
            await expect(signJWT(payload, SECRET)).rejects.toThrow(
                "No secret provided for signing the JWT"
            );
        });

        it("should generate a token that can be verified", async () => {
            const SECRET = process.env.JWT_SECRET;
            const payload = { userId: 123 };
            const token = await signJWT(payload, SECRET);

            const verifiedPayload = await verifyJWT(token, SECRET);

            expect(verifiedPayload.userId).toBe(123);
        });
    });

    describe("verifyJWT", () => {
        const secret = "my-secret";
        let token;
        const payload = { userId: 123 };

        beforeAll(async () => {
            // Generate a valid token before running tests
            token = await signJWT(payload, secret);
        });

        it("should return the payload for a valid token", async () => {
            const result = await verifyJWT(token, secret);

            expect(result).toEqual({
                ...payload,
                exp: expect.any(Number),
                iat: expect.any(Number),
            });
        });

        it("should return undefined for an invalid token", async () => {
            // Generate a token with a different secret
            const invalidToken = await signJWT(payload, "wrong-secret");

            const result = await verifyJWT(invalidToken, secret);

            expect(result).toBeUndefined();
        });

        it("should return undefined if no secret is provided", async () => {
            const result = await verifyJWT(token, undefined);

            expect(result).toBeUndefined();
        });

        it("should return undefined for a malformed token", async () => {
            const result = await verifyJWT("malformed.token", secret);

            expect(result).toBeUndefined();
        });
    });

    describe("login", () => {
        it("should call the API and set session on successful login", async () => {
            const username = "testuser";
            const password = "password123";
            const token = "mock.jwt.token";
            const SERVER = process.env.SERVER;

            // Mock the fetch call to return a successful response with a token
            fetch.mockResolvedValue(new Response(JSON.stringify({ token }), { status: 200 }));

            // Mock setSession to ensure it's called with the correct token
            setSession.mockResolvedValue(undefined);

            await login(username, password);

            expect(fetch).toHaveBeenCalledWith(`${SERVER}/api/auth/login`, {
                method: "POST",
                body: JSON.stringify({ username, password }),
            });
            expect(setSession).toHaveBeenCalledWith(token);
        });

        it("should throw an error for invalid credentials", async () => {
            const username = "invaliduser";
            const password = "wrongpassword";

            // Mock the fetch call to return an error response
            fetch.mockResolvedValue(new Response(null, { status: 401 }));

            await expect(login(username, password)).rejects.toThrow(
                "Username or password incorrect."
            );
        });

        it("should handle missing token in the response", async () => {
            const username = "testuser";
            const password = "password123";

            // Mock the fetch call to return a successful response without a token
            fetch.mockResolvedValue(new Response(JSON.stringify({}), { status: 200 }));

            // Mock setSession to ensure it is not called
            setSession.mockResolvedValue(undefined);

            await login(username, password);

            // Ensure setSession is not called since there was no token
            expect(setSession).not.toHaveBeenCalled();
        });
    });

    describe("logout", () => {
        it("should call destroySesion()", async () => {
            logout();

            expect(destroySesion).toHaveBeenCalled();
        });
    });
});
