/**
 * @jest-environment node
 */

import { GET, POST } from "@/app/api/guides/route.js";
import GuideService from "@/services/GuideService";
import { returnValidationError } from "@/utils/errors";
import { guideCreateValidate } from "@/schemas/ajvSetup";
import { isValidLatitude, isValidLongitude } from "@/utils/helpers";
import { commonAfterAll } from "../testCommon";

jest.mock("@/services/GuideService", () => ({
    getGuides: jest.fn(),
    getGuidesByLatLong: jest.fn(),
    addGuide: jest.fn(),
}));

jest.mock("@/utils/errors", () => ({
    returnValidationError: jest.fn(),
}));

jest.mock("@/schemas/ajvSetup", () => ({
    guideCreateValidate: jest.fn(),
}));

jest.mock("@/utils/helpers", () => ({
    isValidLatitude: jest.fn(),
    isValidLongitude: jest.fn(),
}));

afterAll(commonAfterAll);

describe("GET /api/guides", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return guides by lat/long on success", async () => {
        const lat = "40.7128";
        const long = "-74.0060";
        const mockGuides = [{ id: "guide1" }, { id: "guide2" }];

        isValidLatitude.mockReturnValue(true);
        isValidLongitude.mockReturnValue(true);
        GuideService.getGuidesByLatLong.mockResolvedValue(mockGuides);

        const request = {
            nextUrl: { searchParams: new URLSearchParams({ lat, long }) },
        };

        const response = await GET(request);
        const responseBody = await response.json();

        expect(response.status).toBe(200);
        expect(responseBody).toEqual(mockGuides);
    });

    it("should return all guides on success", async () => {
        const mockGuides = [{ id: "guide1" }, { id: "guide2" }];

        GuideService.getGuides.mockResolvedValue(mockGuides);

        const request = { nextUrl: { searchParams: new URLSearchParams() } };

        const response = await GET(request);
        const responseBody = await response.json();

        expect(response.status).toBe(200);
        expect(responseBody).toEqual(mockGuides);
    });

    it("should return an error on failure", async () => {
        const errorMessage = "Unable to fetch guides";

        GuideService.getGuides.mockRejectedValue(new Error(errorMessage));

        const request = { nextUrl: { searchParams: new URLSearchParams() } };

        const response = await GET(request);
        const responseBody = await response.json();

        expect(response.status).toBe(500);
        expect(responseBody).toEqual({ error: errorMessage });
    });
});

describe("POST /api/guides", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should create a guide and return it on success", async () => {
        const newGuide = {
            authorId: "author1",
            googlePlaceId: "place1",
            title: "New Guide",
            isPrivate: false,
            latitude: "40.7128",
            longitude: "-74.0060",
        };
        const createdGuide = { ...newGuide, id: "guide123" };

        guideCreateValidate.mockReturnValue(true);
        GuideService.addGuide.mockResolvedValue(createdGuide);

        const request = {
            json: jest.fn().mockResolvedValue(newGuide),
        };

        const response = await POST(request);
        const responseBody = await response.json();

        expect(response.status).toBe(200);
        expect(responseBody).toEqual(createdGuide);
    });

    it("should return a validation error if guideCreateValidate fails", async () => {
        const validationErrors = [{ message: "Invalid data" }];

        guideCreateValidate.mockReturnValue(false);
        returnValidationError.mockImplementation(
            () => new Response(JSON.stringify({ errors: ["Invalid data"] }), { status: 400 })
        );
        guideCreateValidate.errors = validationErrors;

        const request = {
            json: jest.fn().mockResolvedValue({ title: "Invalid guide" }), // Invalid input
        };

        const response = await POST(request);
        const responseBody = await response.json();

        expect(response.status).toBe(400);
        expect(responseBody).toEqual({ errors: ["Invalid data"] });
        expect(returnValidationError).toHaveBeenCalledWith(validationErrors);
    });

    it("should return an error if guide creation fails", async () => {
        const errorMessage = "Guide creation failed";

        guideCreateValidate.mockReturnValue(true);
        GuideService.addGuide.mockRejectedValue(new Error(errorMessage));

        const request = {
            json: jest.fn().mockResolvedValue({
                authorId: "author1",
                googlePlaceId: "place1",
                title: "New Guide",
                isPrivate: false,
                latitude: "40.7128",
                longitude: "-74.0060",
            }),
        };

        const response = await POST(request);
        const responseBody = await response.json();

        expect(response.status).toBe(500);
        expect(responseBody).toEqual({ error: errorMessage });
    });
});
