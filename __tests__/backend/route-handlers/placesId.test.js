/**
 * @jest-environment node
 */

import { GET, PATCH, DELETE } from "@/app/api/places/[id]/route.js";
import GuidePlaceService from "@/services/GuidePlaceService";
import { returnValidationError } from "@/utils/errors";
import { placeUpdateValidate } from "@/schemas/ajvSetup";
import { commonAfterAll } from "../testCommon";

jest.mock("@/services/GuidePlaceService", () => ({
    getGuidePlaceById: jest.fn(),
    updateGuidePlace: jest.fn(),
    deleteGuidePlace: jest.fn(),
}));

jest.mock("@/utils/errors", () => ({
    returnValidationError: jest.fn(),
}));

jest.mock("@/schemas/ajvSetup", () => ({
    placeUpdateValidate: jest.fn(),
}));

afterAll(commonAfterAll);

describe("GET /api/admin/places/[id]", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return a place on success", async () => {
        const placeId = "place123";
        const mockPlace = { id: placeId, description: "Sample Place" };

        GuidePlaceService.getGuidePlaceById.mockResolvedValue(mockPlace);

        const request = {};
        const params = { id: placeId };

        const response = await GET(request, { params });
        const responseBody = await response.json();

        expect(response.status).toBe(200);
        expect(responseBody).toEqual(mockPlace);
    });

    it("should return an error on failure", async () => {
        const placeId = "place123";
        const errorMessage = "Unable to fetch place";

        GuidePlaceService.getGuidePlaceById.mockRejectedValue(new Error(errorMessage));

        const request = {};
        const params = { id: placeId };

        const response = await GET(request, { params });
        const responseBody = await response.json();

        expect(response.status).toBe(500);
        expect(responseBody).toEqual({ error: errorMessage });
    });
});

describe("PATCH /api/admin/places/[id]", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should update place and return updated place on success", async () => {
        const placeId = "place123";
        const updateData = { description: "Updated Place", recType: "newType" };
        const updatedPlace = { id: placeId, ...updateData };

        placeUpdateValidate.mockReturnValue(true);
        GuidePlaceService.updateGuidePlace.mockResolvedValue(updatedPlace);

        const request = {
            json: jest.fn().mockResolvedValue(updateData),
        };

        const response = await PATCH(request, { params: { id: placeId } });
        const responseBody = await response.json();

        expect(response.status).toBe(200);
        expect(responseBody).toEqual(updatedPlace);
    });

    it("should return a validation error if placeUpdateValidate fails", async () => {
        const validationErrors = [{ message: "Invalid data" }];

        placeUpdateValidate.mockReturnValue(false);
        returnValidationError.mockImplementation(
            () => new Response(JSON.stringify({ errors: ["Invalid data"] }), { status: 400 })
        );
        placeUpdateValidate.errors = validationErrors;

        const request = {
            json: jest.fn().mockResolvedValue({ description: "Invalid Place" }), // Invalid input
        };

        const response = await PATCH(request, { params: { id: "place123" } });
        const responseBody = await response.json();

        expect(response.status).toBe(400);
        expect(responseBody).toEqual({ errors: ["Invalid data"] });
        expect(returnValidationError).toHaveBeenCalledWith(validationErrors);
    });

    it("should return an error if place update fails", async () => {
        const errorMessage = "Place update failed";

        placeUpdateValidate.mockReturnValue(true);
        GuidePlaceService.updateGuidePlace.mockRejectedValue(new Error(errorMessage));

        const request = {
            json: jest.fn().mockResolvedValue({
                description: "Updated Place",
                recType: "newType",
            }),
        };

        const response = await PATCH(request, { params: { id: "place123" } });
        const responseBody = await response.json();

        expect(response.status).toBe(500);
        expect(responseBody).toEqual({ error: errorMessage });
    });
});

describe("DELETE /api/admin/places/[id]", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should delete place and return success on success", async () => {
        const placeId = "place123";
        const deletedPlace = { id: placeId };

        GuidePlaceService.deleteGuidePlace.mockResolvedValue(deletedPlace);

        const request = {};

        const response = await DELETE(request, { params: { id: placeId } });
        const responseBody = await response.json();

        expect(response.status).toBe(200);
        expect(responseBody).toEqual({ deleted: placeId });
    });

    it("should return an error on failure", async () => {
        const placeId = "place123";
        const errorMessage = "Unable to delete place";

        GuidePlaceService.deleteGuidePlace.mockRejectedValue(new Error(errorMessage));

        const request = {};

        const response = await DELETE(request, { params: { id: placeId } });
        const responseBody = await response.json();

        expect(response.status).toBe(500);
        expect(responseBody).toEqual({ error: errorMessage });
    });
});
