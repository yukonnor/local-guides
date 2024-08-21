/**
 * @jest-environment node
 */

import { handleRegister } from "@/app/actions/auth/handleRegister";
import UserService from "@/services/UserService";
import { signJWT } from "@/lib/authHandler";
import { createToastCookie } from "@/app/actions/cookieActions";
import { setSession } from "@/lib/sessionHandler";
import { redirect } from "next/navigation";
const { commonAfterAll } = require("../../testCommon");

// Mock the imported functions
jest.mock("@/services/UserService", () => ({
    registerUser: jest.fn(),
}));

jest.mock("@/lib/authHandler", () => ({
    signJWT: jest.fn(),
}));

jest.mock("@/app/actions/cookieActions", () => ({
    createToastCookie: jest.fn(),
}));

jest.mock("@/lib/sessionHandler", () => ({
    setSession: jest.fn(),
}));

jest.mock("next/navigation", () => ({
    redirect: jest.fn(),
}));

afterAll(commonAfterAll);

describe("handleRegister", () => {
    const formData = new Map([
        ["username", "testuser"],
        ["password", "password123"],
        ["email", "test@example.com"],
    ]);

    const mockUser = {
        id: 1,
        username: "testuser",
        isAdmin: false,
    };

    const mockToken = "mock-jwt-token";

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should register a new user, set session, create a success toast cookie, and redirect on success", async () => {
        UserService.registerUser.mockResolvedValue(mockUser);
        signJWT.mockResolvedValue(mockToken);

        await handleRegister(formData);

        expect(UserService.registerUser).toHaveBeenCalledWith({
            username: "testuser",
            password: "password123",
            email: "test@example.com",
        });
        expect(signJWT).toHaveBeenCalledWith(
            {
                id: mockUser.id,
                username: mockUser.username,
                isAdmin: mockUser.isAdmin,
            },
            process.env.JWT_SECRET
        );
        expect(setSession).toHaveBeenCalledWith(mockToken);
        expect(createToastCookie).toHaveBeenCalledWith(
            "success",
            "Welcome to Local Guides, testuser!",
            "👋"
        );
        expect(redirect).toHaveBeenCalledWith("/");
    });

    it("should create an error toast cookie with specific message for username taken", async () => {
        const error = new Error("Username is taken");
        error.code = "23505"; // PostgreSQL error code for unique violation
        UserService.registerUser.mockRejectedValue(error);

        await handleRegister(formData);

        expect(UserService.registerUser).toHaveBeenCalled();
        expect(createToastCookie).toHaveBeenCalledWith("error", "That username is taken.");
        expect(redirect).not.toHaveBeenCalled();
    });

    it("should create an error toast cookie with specific message for invalid email", async () => {
        const error = new Error("Invalid email");
        error.code = "23514"; // PostgreSQL error code for check violation
        UserService.registerUser.mockRejectedValue(error);

        await handleRegister(formData);

        expect(UserService.registerUser).toHaveBeenCalled();
        expect(createToastCookie).toHaveBeenCalledWith(
            "error",
            "Please provide a valid email address."
        );
        expect(redirect).not.toHaveBeenCalled();
    });

    it("should create a general error toast cookie for other errors", async () => {
        const errorMessage = "Something went wrong";
        const error = new Error(errorMessage);
        UserService.registerUser.mockRejectedValue(error);

        await handleRegister(formData);

        expect(UserService.registerUser).toHaveBeenCalled();
        expect(createToastCookie).toHaveBeenCalledWith("error", errorMessage);
        expect(redirect).not.toHaveBeenCalled();
    });
});
