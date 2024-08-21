/**
 * @jest-environment node
 */

import { GET, POST } from "@/app/api/guides/[id]/shares/route.js";
import GuideShareService from "@/services/GuideShareService";
import { guideShareValidate } from "@/schemas/ajvSetup";
import { returnValidationError } from "@/utils/errors";
import { commonAfterAll } from "../testCommon";

jest.mock("@/services/GuideShareService", () => ({
    getSharesByGuideId: jest.fn(),
    addShareToGuide: jest.fn(),
}));

jest.mock("@/schemas/ajvSetup", () => ({
    guideShareValidate: jest.fn(),
}));

jest.mock("@/utils/errors", () => ({
    returnValidationError: jest.fn(),
}));

afterAll(commonAfterAll);

describe("GET /api/guides/[id]/shares", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return shares on success", async () => {
        const guideId = "guide123";
        const mockShares = [{ userId: "user1" }, { userId: "user2" }];

        GuideShareService.getSharesByGuideId.mockResolvedValue(mockShares);

        const request = {};
        const params = { id: guideId };

        const response = await GET(request, { params });
        const responseBody = await response.json();

        expect(response.status).toBe(200);
        expect(responseBody).toEqual(mockShares);
    });

    it("should return an error on failure", async () => {
        const guideId = "guide123";
        const errorMessage = "Unable to fetch shares";

        GuideShareService.getSharesByGuideId.mockRejectedValue(new Error(errorMessage));

        const request = {};
        const params = { id: guideId };

        const response = await GET(request, { params });
        const responseBody = await response.json();

        expect(response.status).toBe(500);
        expect(responseBody).toEqual({ error: errorMessage });
    });
});

describe("POST /api/guides/[id]/shares", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should add a share to guide and return success on valid input", async () => {
        const guideId = "guide123";
        const email = "test@example.com";
        const mockGuideShare = { id: "share123", guideId, email };

        guideShareValidate.mockReturnValue(true);
        GuideShareService.addShareToGuide.mockResolvedValue(mockGuideShare);

        const request = {
            json: jest.fn().mockResolvedValue({ email }),
        };

        const response = await POST(request, { params: { id: guideId } });
        const responseBody = await response.json();

        expect(response.status).toBe(200);
        expect(responseBody).toEqual({
            addedShare: {
                id: mockGuideShare.id,
                guideID: mockGuideShare.guideId,
                email: mockGuideShare.email,
            },
        });
    });

    it("should return a validation error if guideShareValidate fails", async () => {
        const validationErrors = [{ message: "Invalid data" }];

        guideShareValidate.mockReturnValue(false);
        returnValidationError.mockImplementation(
            () => new Response(JSON.stringify({ errors: ["Invalid data"] }), { status: 400 })
        );
        guideShareValidate.errors = validationErrors;

        const request = {
            json: jest.fn().mockResolvedValue({ email: "" }), // Invalid input
        };

        const response = await POST(request, { params: { id: "guide123" } });
        const responseBody = await response.json();

        expect(response.status).toBe(400);
        expect(responseBody).toEqual({ errors: ["Invalid data"] });
        expect(returnValidationError).toHaveBeenCalledWith(validationErrors);
    });

    it("should return an error if adding share to guide fails", async () => {
        const errorMessage = "Share addition failed";
        const email = "test@example.com";

        guideShareValidate.mockReturnValue(true);
        GuideShareService.addShareToGuide.mockRejectedValue(new Error(errorMessage));

        const request = {
            json: jest.fn().mockResolvedValue({ email }),
        };

        const response = await POST(request, { params: { id: "guide123" } });
        const responseBody = await response.json();

        expect(response.status).toBe(500);
        expect(responseBody).toEqual({ error: errorMessage });
    });
});
