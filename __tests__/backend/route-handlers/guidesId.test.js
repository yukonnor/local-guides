/**
 * @jest-environment node
 */

import { GET, PATCH, DELETE } from "@/app/api/guides/[id]/route.js";
import GuideService from "@/services/GuideService";
import { returnValidationError } from "@/utils/errors";
import { guideUpdateValidate } from "@/schemas/ajvSetup";
import { commonAfterAll } from "../testCommon";

jest.mock("@/services/GuideService", () => ({
    getGuideById: jest.fn(),
    updateGuide: jest.fn(),
    deleteGuide: jest.fn(),
}));

jest.mock("@/utils/errors", () => ({
    returnValidationError: jest.fn(),
}));

jest.mock("@/schemas/ajvSetup", () => ({
    guideUpdateValidate: jest.fn(),
}));

afterAll(commonAfterAll);

describe("GET /api/guides/[id]", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return a guide on success", async () => {
        const guideId = "guide123";
        const mockGuide = { id: guideId, title: "Sample Guide" };

        GuideService.getGuideById.mockResolvedValue(mockGuide);

        const request = {};
        const params = { id: guideId };

        const response = await GET(request, { params });
        const responseBody = await response.json();

        expect(response.status).toBe(200);
        expect(responseBody).toEqual(mockGuide);
    });

    it("should return an error on failure", async () => {
        const guideId = "guide123";
        const errorMessage = "Unable to fetch guide";

        GuideService.getGuideById.mockRejectedValue(new Error(errorMessage));

        const request = {};
        const params = { id: guideId };

        const response = await GET(request, { params });
        const responseBody = await response.json();

        expect(response.status).toBe(500);
        expect(responseBody).toEqual({ error: errorMessage });
    });
});

describe("PATCH /api/guides/[id]", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should update guide and return updated guide on success", async () => {
        const guideId = "guide123";
        const updateData = {
            title: "Updated Guide",
            description: "Updated description",
            isPrivate: true,
        };
        const updatedGuide = { id: guideId, ...updateData };

        guideUpdateValidate.mockReturnValue(true);
        GuideService.updateGuide.mockResolvedValue(updatedGuide);

        const request = {
            json: jest.fn().mockResolvedValue(updateData),
        };

        const response = await PATCH(request, { params: { id: guideId } });
        const responseBody = await response.json();

        expect(response.status).toBe(200);
        expect(responseBody).toEqual(updatedGuide);
    });

    it("should return a validation error if guideUpdateValidate fails", async () => {
        const validationErrors = [{ message: "Invalid data" }];

        guideUpdateValidate.mockReturnValue(false);
        returnValidationError.mockImplementation(
            () => new Response(JSON.stringify({ errors: ["Invalid data"] }), { status: 400 })
        );
        guideUpdateValidate.errors = validationErrors;

        const request = {
            json: jest.fn().mockResolvedValue({ title: "Invalid Guide" }), // Invalid input
        };

        const response = await PATCH(request, { params: { id: "guide123" } });
        const responseBody = await response.json();

        expect(response.status).toBe(400);
        expect(responseBody).toEqual({ errors: ["Invalid data"] });
        expect(returnValidationError).toHaveBeenCalledWith(validationErrors);
    });

    it("should return an error if guide update fails", async () => {
        const errorMessage = "Guide update failed";

        guideUpdateValidate.mockReturnValue(true);
        GuideService.updateGuide.mockRejectedValue(new Error(errorMessage));

        const request = {
            json: jest.fn().mockResolvedValue({
                title: "Updated Guide",
                description: "Updated description",
                isPrivate: true,
            }),
        };

        const response = await PATCH(request, { params: { id: "guide123" } });
        const responseBody = await response.json();

        expect(response.status).toBe(500);
        expect(responseBody).toEqual({ error: errorMessage });
    });
});

describe("DELETE /api/guides/[id]", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should delete guide and return success on success", async () => {
        const guideId = "guide123";
        const deletedGuide = { id: guideId };

        GuideService.deleteGuide.mockResolvedValue(deletedGuide);

        const request = {};

        const response = await DELETE(request, { params: { id: guideId } });
        const responseBody = await response.json();

        expect(response.status).toBe(200);
        expect(responseBody).toEqual({ deleted: guideId });
    });

    it("should return an error on failure", async () => {
        const guideId = "guide123";
        const errorMessage = "Unable to delete guide";

        GuideService.deleteGuide.mockRejectedValue(new Error(errorMessage));

        const request = {};

        const response = await DELETE(request, { params: { id: guideId } });
        const responseBody = await response.json();

        expect(response.status).toBe(500);
        expect(responseBody).toEqual({ error: errorMessage });
    });
});
