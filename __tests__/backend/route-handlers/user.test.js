/**
 * @jest-environment node
 */

import { GET, POST } from "@/app/api/users/route.js";
import UserService from "@/services/UserService";
import { returnValidationError } from "@/utils/errors";
import { userCreateValidate } from "@/schemas/ajvSetup";
import { signJWT } from "@/lib/authHandler";
import { commonAfterAll } from "../testCommon";

jest.mock("@/services/UserService", () => ({
    registerUser: jest.fn(),
    getUsers: jest.fn(),
}));

jest.mock("@/utils/errors", () => ({
    returnValidationError: jest.fn(),
}));

jest.mock("@/schemas/ajvSetup", () => ({
    userCreateValidate: jest.fn(),
}));

jest.mock("@/lib/authHandler", () => ({
    signJWT: jest.fn(),
}));

afterAll(commonAfterAll);

describe("GET /api/admin/users", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return a list of users on success", async () => {
        const mockUsers = [{ username: "testuser1" }, { username: "testuser2" }];
        UserService.getUsers.mockResolvedValue(mockUsers);

        const request = {}; // Adjust if needed
        const response = await GET(request);
        const responseBody = await response.json();

        expect(response.status).toBe(200);
        expect(responseBody).toEqual(mockUsers);
    });

    it("should return an error on failure", async () => {
        const errorMessage = "Unable to fetch users";
        UserService.getUsers.mockRejectedValue(new Error(errorMessage));

        const request = {}; // Adjust if needed
        const response = await GET(request);
        const responseBody = await response.json();

        expect(response.status).toBe(500);
        expect(responseBody).toEqual({ error: errorMessage });
    });
});

describe("POST /api/admin/users", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should create a user and return a token on success", async () => {
        const newUser = { username: "newuser", email: "newuser@example.com", isAdmin: false };
        const token = "mocktoken";

        userCreateValidate.mockReturnValue(true);
        UserService.registerUser.mockResolvedValue(newUser);
        signJWT.mockResolvedValue(token);

        const request = {
            json: jest.fn().mockResolvedValue(newUser),
        };

        const response = await POST(request);
        const responseBody = await response.json();

        expect(response.status).toBe(200);
        expect(responseBody).toEqual({ user: newUser, token });
    });

    it("should return a validation error if userCreateValidate fails", async () => {
        const mockErrorResponse = { errors: ["Error message"] };

        userCreateValidate.mockReturnValue(false);
        returnValidationError.mockImplementation(
            () => new Response(JSON.stringify(mockErrorResponse), { status: 400 })
        );

        const request = {
            json: jest.fn().mockResolvedValue({ username: "newuser" }), // Invalid input
        };

        const response = await POST(request);
        const responseBody = await response.json();

        expect(response.status).toBe(400);
        expect(responseBody).toEqual({ errors: ["Error message"] });
        expect(returnValidationError).toHaveBeenCalledWith(userCreateValidate.errors);
    });

    it("should return an error if user registration fails", async () => {
        const errorMessage = "Registration failed";

        userCreateValidate.mockReturnValue(true);
        UserService.registerUser.mockRejectedValue(new Error(errorMessage));

        const request = {
            json: jest.fn().mockResolvedValue({
                username: "newuser",
                email: "newuser@example.com",
                isAdmin: false,
            }),
        };

        const response = await POST(request);
        const responseBody = await response.json();

        expect(response.status).toBe(500);
        expect(responseBody).toEqual({ error: errorMessage });
    });
});
