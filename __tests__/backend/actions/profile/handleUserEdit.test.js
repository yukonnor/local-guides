/**
 * @jest-environment node
 */

import { handleUserEdit } from "@/app/actions/profile/handleUserEdit";
import UserService from "@/services/UserService";
import { createToastCookie } from "@/app/actions/cookieActions";
import { redirect } from "next/navigation";
const { commonAfterAll } = require("../../testCommon");

afterAll(commonAfterAll);

// Mock the imported functions
jest.mock("@/services/UserService", () => ({
    updateUser: jest.fn(),
}));

jest.mock("@/app/actions/cookieActions", () => ({
    createToastCookie: jest.fn(),
}));

jest.mock("next/navigation", () => ({
    redirect: jest.fn(),
}));

describe("handleUserEdit", () => {
    const userId = 1;
    const formData = new Map();
    formData.set("username", "newUsername");
    formData.set("email", "newEmail@example.com");

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should update the user, create a success toast cookie, and redirect on success", async () => {
        UserService.updateUser.mockResolvedValue({
            id: userId,
            username: "newUsername",
            email: "newEmail@example.com",
        });

        await handleUserEdit(userId, formData);

        expect(UserService.updateUser).toHaveBeenCalledWith(userId, {
            username: "newUsername",
            email: "newEmail@example.com",
        });
        expect(createToastCookie).toHaveBeenCalledWith(
            "success",
            "Successfully updated your account."
        );
        expect(redirect).toHaveBeenCalledWith(`/profile/${userId}`);
    });

    it("should create an error toast cookie if there is an error updating the user with a taken username", async () => {
        const error = new Error("Username taken");
        error.code = 23505;
        UserService.updateUser.mockRejectedValue(error);

        await handleUserEdit(userId, formData);

        expect(UserService.updateUser).toHaveBeenCalledWith(userId, {
            username: "newUsername",
            email: "newEmail@example.com",
        });
        expect(createToastCookie).toHaveBeenCalledWith("error", "That username is taken.");
        expect(redirect).not.toHaveBeenCalled();
    });

    it("should create an error toast cookie if there is an error updating the user with an invalid email", async () => {
        const error = new Error("Invalid email");
        error.code = 23514;
        UserService.updateUser.mockRejectedValue(error);

        await handleUserEdit(userId, formData);

        expect(UserService.updateUser).toHaveBeenCalledWith(userId, {
            username: "newUsername",
            email: "newEmail@example.com",
        });
        expect(createToastCookie).toHaveBeenCalledWith(
            "error",
            "Please provide a valid email address."
        );
        expect(redirect).not.toHaveBeenCalled();
    });

    it("should create an error toast cookie if there is a general error updating the user", async () => {
        const error = new Error("General error");
        UserService.updateUser.mockRejectedValue(error);

        await handleUserEdit(userId, formData);

        expect(UserService.updateUser).toHaveBeenCalledWith(userId, {
            username: "newUsername",
            email: "newEmail@example.com",
        });
        expect(createToastCookie).toHaveBeenCalledWith("error", "General error");
        expect(redirect).not.toHaveBeenCalled();
    });
});
