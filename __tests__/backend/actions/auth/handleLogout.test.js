/**
 * @jest-environment node
 */

import { handleLogout } from "@/app/actions/auth/handleLogout";
import { logout } from "@/lib/authHandler";
import { createToastCookie } from "@/app/actions/cookieActions";
import { redirect } from "next/navigation";
const { commonAfterAll } = require("../../testCommon");

// Mock the imported functions
jest.mock("@/lib/authHandler", () => ({
    logout: jest.fn(),
}));

jest.mock("@/app/actions/cookieActions", () => ({
    createToastCookie: jest.fn(),
}));

jest.mock("next/navigation", () => ({
    redirect: jest.fn(),
}));

afterAll(commonAfterAll);

describe("handleLogout", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should call logout and create a success toast cookie on successful logout", async () => {
        logout.mockResolvedValue();

        await handleLogout();

        expect(logout).toHaveBeenCalled();
        expect(createToastCookie).toHaveBeenCalledWith("success", "Successfully logged out!");
        expect(redirect).toHaveBeenCalledWith("/");
    });

    it("should create an error toast cookie and not redirect on logout failure", async () => {
        const errorMessage = "Logout failed";
        logout.mockRejectedValue(new Error(errorMessage));

        await handleLogout();

        expect(logout).toHaveBeenCalled();
        expect(createToastCookie).toHaveBeenCalledWith("error", "Error: Could not log out.");
        expect(redirect).not.toHaveBeenCalled();
    });
});
