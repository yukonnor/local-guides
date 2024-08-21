/**
 * @jest-environment node
 */

import { GET, POST } from "@/app/api/guides/[id]/places/route.js";
import GuidePlaceService from "@/services/GuidePlaceService";
import { returnValidationError } from "@/utils/errors";
import { placeCreateValidate } from "@/schemas/ajvSetup";
import { commonAfterAll } from "../testCommon";

jest.mock("@/services/GuidePlaceService", () => ({
    getGuidePlacesByGuideId: jest.fn(),
    addGuidePlace: jest.fn(),
}));

jest.mock("@/utils/errors", () => ({
    returnValidationError: jest.fn(),
}));

jest.mock("@/schemas/ajvSetup", () => ({
    placeCreateValidate: jest.fn(),
}));

afterAll(commonAfterAll);

describe("GET /api/guides/[id]/places", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return places on success", async () => {
        const guideId = "guide123";
        const mockPlaces = [{ name: "Place1" }, { name: "Place2" }];

        GuidePlaceService.getGuidePlacesByGuideId.mockResolvedValue(mockPlaces);

        const request = {};
        const params = { id: guideId };

        const response = await GET(request, { params });
        const responseBody = await response.json();

        expect(response.status).toBe(200);
        expect(responseBody).toEqual(mockPlaces);
    });

    it("should return an error on failure", async () => {
        const guideId = "guide123";
        const errorMessage = "Unable to fetch places";

        GuidePlaceService.getGuidePlacesByGuideId.mockRejectedValue(new Error(errorMessage));

        const request = {};
        const params = { id: guideId };

        const response = await GET(request, { params });
        const responseBody = await response.json();

        expect(response.status).toBe(500);
        expect(responseBody).toEqual({ error: errorMessage });
    });
});

describe("POST /api/guides/[id]/places", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should add a place to guide and return success on valid input", async () => {
        const guideId = "guide123";
        const place = { name: "Sample Place" };
        const mockAddedPlace = { id: "place123", ...place };

        placeCreateValidate.mockReturnValue(true);
        GuidePlaceService.addGuidePlace.mockResolvedValue(mockAddedPlace);

        const request = {
            json: jest.fn().mockResolvedValue(place),
        };

        const response = await POST(request, { params: { id: guideId } });
        const responseBody = await response.json();

        expect(response.status).toBe(200);
        expect(responseBody).toEqual({ addedPlace: mockAddedPlace });
    });

    it("should return a validation error if placeCreateValidate fails", async () => {
        const validationErrors = [{ message: "Invalid data" }];

        placeCreateValidate.mockReturnValue(false);
        returnValidationError.mockImplementation(
            () => new Response(JSON.stringify({ errors: ["Invalid data"] }), { status: 400 })
        );
        placeCreateValidate.errors = validationErrors;

        const request = {
            json: jest.fn().mockResolvedValue({ name: "" }), // Invalid input
        };

        const response = await POST(request, { params: { id: "guide123" } });
        const responseBody = await response.json();

        expect(response.status).toBe(400);
        expect(responseBody).toEqual({ errors: ["Invalid data"] });
        expect(returnValidationError).toHaveBeenCalledWith(validationErrors);
    });

    it("should return an error if adding place to guide fails", async () => {
        const errorMessage = "Place addition failed";
        const place = { name: "Sample Place" };

        placeCreateValidate.mockReturnValue(true);
        GuidePlaceService.addGuidePlace.mockRejectedValue(new Error(errorMessage));

        const request = {
            json: jest.fn().mockResolvedValue(place),
        };

        const response = await POST(request, { params: { id: "guide123" } });
        const responseBody = await response.json();

        expect(response.status).toBe(500);
        expect(responseBody).toEqual({ error: errorMessage });
    });
});
