/**
 * @jest-environment node
 */

import { handleLogin } from "@/app/actions/auth/handleLogin";
import { createToastCookie } from "@/app/actions/cookieActions";
import { login } from "@/lib/authHandler";
import { redirect } from "next/navigation";
const { commonAfterAll } = require("../../testCommon");

// Mock the imported functions
jest.mock("@/lib/authHandler", () => ({
    login: jest.fn(),
}));

jest.mock("@/app/actions/cookieActions", () => ({
    createToastCookie: jest.fn(),
}));

jest.mock("next/navigation", () => ({
    redirect: jest.fn(),
}));

afterAll(commonAfterAll);

describe("handleLogin", () => {
    let formData;

    beforeEach(() => {
        formData = new FormData();
        formData.append("username", "testuser");
        formData.append("password", "testpassword");

        jest.clearAllMocks();
    });

    it("should call login and create a success toast cookie on successful login", async () => {
        login.mockResolvedValue();

        await handleLogin(formData);

        expect(login).toHaveBeenCalledWith("testuser", "testpassword");
        expect(createToastCookie).toHaveBeenCalledWith("success", "Welcome back!", "👋");
        expect(redirect).toHaveBeenCalledWith("/");
    });

    it("should create an error toast cookie and not redirect on login failure", async () => {
        const errorMessage = "Invalid credentials";
        login.mockRejectedValue(new Error(errorMessage));

        await handleLogin(formData);

        expect(login).toHaveBeenCalledWith("testuser", "testpassword");
        expect(createToastCookie).toHaveBeenCalledWith("error", errorMessage);
        expect(redirect).not.toHaveBeenCalled();
    });
});
