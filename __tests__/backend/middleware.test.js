/**
 * @jest-environment node
 */

import { middleware } from "@/middleware";
import { verifyJWT } from "@/lib/authHandler";
import { updateSession, getSession } from "@/lib/sessionHandler";
import { NextRequest, NextResponse } from "next/server";
import { commonAfterAll } from "./testCommon";

jest.mock("@/lib/authHandler", () => ({
    verifyJWT: jest.fn(),
}));

jest.mock("@/lib/sessionHandler", () => ({
    updateSession: jest.fn(),
    getSession: jest.fn(),
}));

afterAll(commonAfterAll);

describe("API Route Authorization", () => {
    it("should return 403 for non-admin users accessing protected API routes", async () => {
        verifyJWT.mockResolvedValueOnce({ isAdmin: false });

        const request = new NextRequest("http://localhost/api/some-protected-route", {
            headers: {
                Authorization: "Bearer some-token",
            },
        });

        const response = await middleware(request);

        expect(response.status).toBe(403);
        const responseBody = await response.json();
        expect(responseBody.error).toBe("Forbidden: Must provide current admin token.");
    });

    it("should proceed for admin users accessing protected API routes", async () => {
        verifyJWT.mockResolvedValueOnce({ isAdmin: true });

        const request = new NextRequest("http://localhost/api/some-protected-route", {
            headers: {
                Authorization: "Bearer some-token",
            },
        });

        const response = await middleware(request);

        expect(response).toBeInstanceOf(NextResponse);
        expect(response.status).toBe(200); // Assuming a 200 status as default success case
    });
});

describe("Page Route Authorization", () => {
    it("should redirect to login if user is not logged in and accessing protected routes", async () => {
        getSession.mockResolvedValueOnce(null); // No user

        const request = new NextRequest("http://localhost/guides/new");

        const response = await middleware(request);

        expect(response).toBeInstanceOf(NextResponse);
        const locationHeader = response.headers.get("location");
        expect(locationHeader).toContain("/auth/login?alert=not-authorized");
        expect(response.status).toBe(307); // Redirect status code
    });

    it("should redirect to home if user is logged in and accessing auth routes", async () => {
        getSession.mockResolvedValueOnce({}); // User logged in

        const request = new NextRequest("http://localhost/auth/login");

        const response = await middleware(request);

        expect(response).toBeInstanceOf(NextResponse);
        const locationHeader = response.headers.get("location");
        expect(locationHeader).toContain("/?alert=already-logged-in");
        expect(response.status).toBe(307); // Redirect status code
    });
});

describe("Session Update", () => {
    it("should update the session for all page routes", async () => {
        getSession.mockResolvedValueOnce({}); // User logged in
        updateSession.mockResolvedValueOnce(new NextResponse());

        const request = new NextRequest("http://localhost/profile");

        const response = await middleware(request);

        expect(updateSession).toHaveBeenCalledWith(request);
        expect(response).toBeInstanceOf(NextResponse);
    });
});

describe("Middleware Configuration", () => {
    it("should match paths correctly based on configuration", () => {
        const config = require("@/middleware").config;
        expect(config.matcher).toEqual(["/((?!_next/|_static|_vercel|[\\w-]+\\.\\w+).*)"]);
    });
});
