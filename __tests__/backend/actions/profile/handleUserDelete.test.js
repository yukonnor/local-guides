/**
 * @jest-environment node
 */

import { handleUserDelete } from "@/app/actions/profile/handleUserDelete";
import UserService from "@/services/UserService";
import { logout } from "@/lib/authHandler";
import { createToastCookie } from "@/app/actions/cookieActions";
import { redirect } from "next/navigation";
const { commonAfterAll } = require("../../testCommon");

// Mock the imported functions
jest.mock("@/services/UserService", () => ({
    deleteUser: jest.fn(),
}));

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

describe("handleUserDelete", () => {
    const userId = 1;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should delete the user, log out, create a success toast cookie, and redirect on success", async () => {
        UserService.deleteUser.mockResolvedValue();
        logout.mockResolvedValue();

        await handleUserDelete(userId);

        expect(UserService.deleteUser).toHaveBeenCalledWith(userId);
        expect(logout).toHaveBeenCalled();
        expect(createToastCookie).toHaveBeenCalledWith(
            "success",
            "Successfully deleted your account."
        );
        expect(redirect).toHaveBeenCalledWith("/");
    });

    it("should create an error toast cookie if there is an error deleting the user", async () => {
        const errorMessage = "Could not delete user";
        const error = new Error(errorMessage);
        UserService.deleteUser.mockRejectedValue(error);

        await handleUserDelete(userId);

        expect(UserService.deleteUser).toHaveBeenCalledWith(userId);
        expect(logout).not.toHaveBeenCalled();
        expect(createToastCookie).toHaveBeenCalledWith("error", "Error: Could not delete account.");
        expect(redirect).not.toHaveBeenCalled();
    });

    it("should create an error toast cookie if there is an error logging out after deleting the user", async () => {
        UserService.deleteUser.mockResolvedValue();
        const errorMessage = "Could not log out";
        const error = new Error(errorMessage);
        logout.mockRejectedValue(error);

        await handleUserDelete(userId);

        expect(UserService.deleteUser).toHaveBeenCalledWith(userId);
        expect(logout).toHaveBeenCalled();
        expect(createToastCookie).toHaveBeenCalledWith("error", "Error: Could not delete account.");
        expect(redirect).not.toHaveBeenCalled();
    });
});
