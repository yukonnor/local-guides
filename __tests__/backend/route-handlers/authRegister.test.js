/**
 * @jest-environment node
 */

import { POST } from "@/app/api/auth/register/route.js";
import UserService from "@/services/UserService";
import { signJWT } from "@/lib/authHandler";
import { returnValidationError } from "@/utils/errors";
import { userRegisterValidate } from "@/schemas/ajvSetup";
import { commonAfterAll } from "../testCommon";

jest.mock("@/services/UserService", () => ({
    registerUser: jest.fn(),
}));

jest.mock("@/lib/authHandler", () => ({
    signJWT: jest.fn(),
}));

jest.mock("@/utils/errors", () => ({
    returnValidationError: jest.fn(),
}));

jest.mock("@/schemas/ajvSetup", () => ({
    userRegisterValidate: jest.fn(),
}));

afterAll(commonAfterAll);

describe("POST /api/auth/register", () => {
    const SECRET = process.env.JWT_SECRET;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return a token on successful registration", async () => {
        const mockUser = { id: 1, username: "testuser", isAdmin: false };
        const mockToken = "mockToken";

        userRegisterValidate.mockReturnValue(true);
        UserService.registerUser.mockResolvedValue(mockUser);
        signJWT.mockResolvedValue(mockToken);

        const request = {
            json: jest.fn().mockResolvedValue({
                username: "testuser",
                password: "testpassword",
                email: "testuser@example.com",
            }),
        };

        const response = await POST(request);
        const responseBody = await response.json();

        expect(response.status).toBe(200);
        expect(responseBody).toEqual({ token: mockToken });
        expect(UserService.registerUser).toHaveBeenCalledWith({
            username: "testuser",
            password: "testpassword",
            email: "testuser@example.com",
        });
        expect(signJWT).toHaveBeenCalledWith(
            { id: mockUser.id, username: mockUser.username, isAdmin: mockUser.isAdmin },
            SECRET
        );
    });

    it("should return a validation error if userRegisterValidate fails", async () => {
        const mockErrorResponse = { errors: ["Error message"] };

        userRegisterValidate.mockReturnValue(false);
        returnValidationError.mockImplementation(
            () => new Response(JSON.stringify(mockErrorResponse), { status: 400 })
        );

        const request = {
            json: jest.fn().mockResolvedValue({ username: "", password: "", email: "" }), // invalid input
        };

        const response = await POST(request);
        const responseBody = await response.json();

        expect(response.status).toBe(400);
        expect(responseBody).toEqual(mockErrorResponse);
        expect(returnValidationError).toHaveBeenCalledWith(userRegisterValidate.errors);
    });

    it("should return an error if registration fails", async () => {
        const errorMessage = "Registration failed";

        userRegisterValidate.mockReturnValue(true);
        UserService.registerUser.mockRejectedValue(new Error(errorMessage));

        const request = {
            json: jest.fn().mockResolvedValue({
                username: "testuser",
                password: "testpassword",
                email: "testuser@example.com",
            }),
        };

        const response = await POST(request);
        const responseBody = await response.json();

        expect(response.status).toBe(500);
        expect(responseBody).toEqual({ error: errorMessage });
    });

    it("should return a 500 error if an unexpected error occurs", async () => {
        userRegisterValidate.mockReturnValue(true);
        UserService.registerUser.mockImplementation(() => {
            throw new Error("Unexpected error");
        });

        const request = {
            json: jest.fn().mockResolvedValue({
                username: "testuser",
                password: "testpassword",
                email: "testuser@example.com",
            }),
        };

        const response = await POST(request);
        const responseBody = await response.json();

        expect(response.status).toBe(500);
        expect(responseBody).toEqual({ error: "Unexpected error" });
    });
});
