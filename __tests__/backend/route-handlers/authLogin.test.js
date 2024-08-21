/**
 * @jest-environment node
 */

import { POST } from "@/app/api/auth/login/route.js";
import UserService from "@/services/UserService";
import { signJWT } from "@/lib/authHandler";
import { returnValidationError } from "@/utils/errors";
import { userLoginValidate } from "@/schemas/ajvSetup";
import { commonAfterAll } from "../testCommon";

jest.mock("@/services/UserService", () => ({
    authenticateUser: jest.fn(),
}));

jest.mock("@/lib/authHandler", () => ({
    signJWT: jest.fn(),
}));

jest.mock("@/utils/errors", () => ({
    returnValidationError: jest.fn(),
}));

jest.mock("@/schemas/ajvSetup", () => ({
    userLoginValidate: jest.fn(),
}));

afterAll(commonAfterAll);

describe("POST  /api/auth/login", () => {
    const SECRET = process.env.JWT_SECRET;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return a token on successful authentication", async () => {
        const mockUser = { id: 1, username: "testuser", isAdmin: false };
        const mockToken = "mockToken";

        userLoginValidate.mockReturnValue(true);
        UserService.authenticateUser.mockResolvedValue(mockUser);
        signJWT.mockResolvedValue(mockToken);

        const request = {
            json: jest.fn().mockResolvedValue({ username: "testuser", password: "testpassword" }),
        };

        const response = await POST(request);

        expect(response.status).toBe(200);
        expect(await response.json()).toEqual({ token: mockToken });
        expect(UserService.authenticateUser).toHaveBeenCalledWith("testuser", "testpassword");
        expect(signJWT).toHaveBeenCalledWith(
            { id: mockUser.id, username: mockUser.username, isAdmin: mockUser.isAdmin },
            SECRET
        );
    });

    it("should return a validation error if userLoginValidate fails", async () => {
        const mockErrorResponse = { errors: ["Error message"] };

        userLoginValidate.mockReturnValue(false);
        returnValidationError.mockImplementation(
            () => new Response(JSON.stringify(mockErrorResponse), { status: 400 })
        );

        const request = {
            json: jest.fn().mockResolvedValue({ username: "", password: "" }), // invalid input
        };

        const response = await POST(request);
        const responseBody = await response.json(); // Ensure this is awaited

        expect(response.status).toBe(400);
        expect(responseBody).toEqual(mockErrorResponse);
        expect(returnValidationError).toHaveBeenCalledWith(userLoginValidate.errors);
    });

    it("should return an error if authentication fails", async () => {
        const errorMessage = "Invalid credentials";

        userLoginValidate.mockReturnValue(true);
        UserService.authenticateUser.mockRejectedValue(new Error(errorMessage));

        const request = {
            json: jest.fn().mockResolvedValue({ username: "testuser", password: "testpassword" }),
        };

        const response = await POST(request);

        expect(response.status).toBe(500);
        expect(await response.json()).toEqual({ error: errorMessage });
    });

    it("should return a 500 error if an unexpected error occurs", async () => {
        userLoginValidate.mockReturnValue(true);
        UserService.authenticateUser.mockImplementation(() => {
            throw new Error("Unexpected error");
        });

        const request = {
            json: jest.fn().mockResolvedValue({ username: "testuser", password: "testpassword" }),
        };

        const response = await POST(request);

        expect(response.status).toBe(500);
        expect(await response.json()).toEqual({ error: "Unexpected error" });
    });
});
