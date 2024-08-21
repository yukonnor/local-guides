/**
 * @jest-environment node
 */

import { GET, PATCH, DELETE } from "@/app/api/users/[id]/route.js";
import UserService from "@/services/UserService";
import GuideShareService from "@/services/GuideShareService";
import { returnValidationError } from "@/utils/errors";
import { userUpdateValidate } from "@/schemas/ajvSetup";
import { commonAfterAll } from "../testCommon";

jest.mock("@/services/UserService", () => ({
    getUserById: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
}));

jest.mock("@/services/GuideShareService", () => ({
    getGuidesBySharedUserId: jest.fn(),
}));

jest.mock("@/utils/errors", () => ({
    returnValidationError: jest.fn(),
}));

jest.mock("@/schemas/ajvSetup", () => ({
    userUpdateValidate: jest.fn(),
}));

afterAll(commonAfterAll);

describe("GET /api/users/[id]", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return user with shared guides on success", async () => {
        const userId = "user123";
        const mockUser = { id: userId, username: "testuser" };
        const mockGuides = [{ id: "guide1" }, { id: "guide2" }];

        UserService.getUserById.mockResolvedValue(mockUser);
        GuideShareService.getGuidesBySharedUserId.mockResolvedValue(mockGuides);

        const request = {};
        const params = { id: userId };

        const response = await GET(request, { params });
        const responseBody = await response.json();

        expect(response.status).toBe(200);
        expect(responseBody).toEqual({ ...mockUser, sharedGuides: mockGuides });
    });

    it("should return an error on failure", async () => {
        const userId = "user123";
        const errorMessage = "Unable to fetch user";

        UserService.getUserById.mockRejectedValue(new Error(errorMessage));

        const request = {};
        const params = { id: userId };

        const response = await GET(request, { params });
        const responseBody = await response.json();

        expect(response.status).toBe(500);
        expect(responseBody).toEqual({ error: errorMessage });
    });
});

describe("PATCH /api/users/[id]", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should update user and return updated user on success", async () => {
        const userId = "user123";
        const updateData = { username: "updateduser" };
        const updatedUser = { id: userId, ...updateData };

        userUpdateValidate.mockReturnValue(true);
        UserService.updateUser.mockResolvedValue(updatedUser);

        const request = {
            json: jest.fn().mockResolvedValue(updateData),
        };

        const response = await PATCH(request, { params: { id: userId } });
        const responseBody = await response.json();

        expect(response.status).toBe(200);
        expect(responseBody).toEqual(updatedUser);
    });

    it("should return a validation error if userUpdateValidate fails", async () => {
        const validationErrors = [{ message: "Invalid email" }];

        userUpdateValidate.mockReturnValue(false);
        returnValidationError.mockImplementation(
            () => new Response(JSON.stringify({ errors: ["Invalid email"] }), { status: 400 })
        );
        userUpdateValidate.errors = validationErrors;

        const request = {
            json: jest.fn().mockResolvedValue({ username: "newuser" }), // Invalid input
        };

        const response = await PATCH(request, { params: { id: "user123" } });
        const responseBody = await response.json();

        expect(response.status).toBe(400);
        expect(responseBody).toEqual({ errors: ["Invalid email"] });
        expect(returnValidationError).toHaveBeenCalledWith(validationErrors);
    });

    it("should return an error if user update fails", async () => {
        const errorMessage = "Update failed";

        userUpdateValidate.mockReturnValue(true);
        UserService.updateUser.mockRejectedValue(new Error(errorMessage));

        const request = {
            json: jest.fn().mockResolvedValue({ username: "newuser" }),
        };

        const response = await PATCH(request, { params: { id: "user123" } });
        const responseBody = await response.json();

        expect(response.status).toBe(500);
        expect(responseBody).toEqual({ error: errorMessage });
    });
});

describe("DELETE /api/users/[id]", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should delete user and return success on success", async () => {
        const userId = "user123";
        const deletedUser = { id: userId };

        UserService.deleteUser.mockResolvedValue(deletedUser);

        const request = {};

        const response = await DELETE(request, { params: { id: userId } });
        const responseBody = await response.json();

        expect(response.status).toBe(200);
        expect(responseBody).toEqual({ deleted: userId });
    });

    it("should return an error on failure", async () => {
        const userId = "user123";
        const errorMessage = "Unable to delete user";

        UserService.deleteUser.mockRejectedValue(new Error(errorMessage));

        const request = {};

        const response = await DELETE(request, { params: { id: userId } });
        const responseBody = await response.json();

        expect(response.status).toBe(500);
        expect(responseBody).toEqual({ error: errorMessage });
    });
});
