/**
 * @jest-environment node
 */

import {
    createLocalityCookie,
    createToastCookie,
    removeToastCookie,
} from "@/app/actions/cookieActions";
import { cookies } from "next/headers";
const { commonAfterAll } = require("../testCommon");

// Mock the cookies function from next/headers
jest.mock("next/headers", () => ({
    cookies: jest.fn(),
}));

afterAll(commonAfterAll);

describe("cookieActions", () => {
    let mockSet;
    let mockDelete;

    beforeAll(() => {
        // Mock the cookies set and delete methods
        mockSet = jest.fn();
        mockDelete = jest.fn();
        cookies.mockReturnValue({ set: mockSet, delete: mockDelete });
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("createLocalityCookie", () => {
        it("should set a locality cookie", async () => {
            const locality = { name: "San Francisco", lat: 37.7749, long: -122.4194 };

            await createLocalityCookie(locality);

            expect(mockSet).toHaveBeenCalledWith({
                name: "locality",
                value: JSON.stringify(locality),
                httpOnly: true,
                secure: true,
                path: "/",
            });
        });
    });

    describe("createToastCookie", () => {
        it("should set a toast cookie", async () => {
            const type = "success";
            const message = "Welcome back!";
            const icon = "👋";

            await createToastCookie(type, message, icon);

            expect(mockSet).toHaveBeenCalledWith({
                name: process.env.TOAST_COOKIE_NAME,
                value: JSON.stringify({ type, message, icon }),
                httpOnly: true,
                secure: true,
                path: "/",
            });
        });

        it("should not set a toast cookie if type or message is empty", async () => {
            await createToastCookie("", "message", "icon");
            expect(mockSet).not.toHaveBeenCalled();

            await createToastCookie("type", "", "icon");
            expect(mockSet).not.toHaveBeenCalled();
        });
    });

    describe("removeToastCookie", () => {
        it("should delete the toast cookie", async () => {
            await removeToastCookie();

            expect(mockDelete).toHaveBeenCalledWith(process.env.TOAST_COOKIE_NAME);
        });
    });
});
