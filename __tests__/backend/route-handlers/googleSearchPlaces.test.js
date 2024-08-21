/**
 * @jest-environment node
 */

import { POST } from "@/app/api/google/search-places/route.js";
import { searchPlaces, searchLocalities } from "@/lib/api/googlePlaces";
import { returnValidationError } from "@/utils/errors";
import { googleSearchPlaceValidate } from "@/schemas/ajvSetup";
import { isValidLatitude, isValidLongitude } from "@/utils/helpers";
import { AppError } from "@/utils/errors";
import { commonAfterAll } from "../testCommon";

jest.mock("@/lib/api/googlePlaces", () => ({
    searchPlaces: jest.fn(),
    searchLocalities: jest.fn(),
}));

jest.mock("@/utils/errors", () => ({
    returnValidationError: jest.fn(),
}));

jest.mock("@/schemas/ajvSetup", () => ({
    googleSearchPlaceValidate: jest.fn(),
}));

jest.mock("@/utils/helpers", () => ({
    isValidLatitude: jest.fn(),
    isValidLongitude: jest.fn(),
}));

afterAll(commonAfterAll);

describe("POST /api/google/search-places", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return results from searchLocalities when placeType is 'locality'", async () => {
        const mockResults = [{ place: "Locality Place" }];
        googleSearchPlaceValidate.mockReturnValue(true);
        searchLocalities.mockResolvedValue(mockResults);

        const request = {
            json: jest.fn().mockResolvedValue({ placeType: "locality", textQuery: "test" }),
        };

        const response = await POST(request);
        const responseBody = await response.json();

        expect(response.status).toBe(200);
        expect(responseBody).toEqual(mockResults);
        expect(searchLocalities).toHaveBeenCalledWith("test");
    });

    it("should return results from searchPlaces when placeType is 'place' and latitude and longitude are valid", async () => {
        const mockResults = [{ place: "Place Place" }];
        googleSearchPlaceValidate.mockReturnValue(true);
        isValidLatitude.mockReturnValue(true);
        isValidLongitude.mockReturnValue(true);
        searchPlaces.mockResolvedValue(mockResults);

        const request = {
            json: jest.fn().mockResolvedValue({
                placeType: "place",
                textQuery: "test",
                latitude: 40.7128,
                longitude: -74.006,
            }),
        };

        const response = await POST(request);
        const responseBody = await response.json();

        expect(response.status).toBe(200);
        expect(responseBody).toEqual(mockResults);
        expect(searchPlaces).toHaveBeenCalledWith("test");
    });

    it("should return a validation error if googleSearchPlaceValidate fails", async () => {
        const mockErrorResponse = { errors: ["Error message"] };

        googleSearchPlaceValidate.mockReturnValue(false);
        returnValidationError.mockImplementation(
            () => new Response(JSON.stringify(mockErrorResponse), { status: 400 })
        );

        const request = {
            json: jest.fn().mockResolvedValue({ placeType: "place", textQuery: "" }), // invalid input
        };

        const response = await POST(request);
        const responseBody = await response.json();

        expect(response.status).toBe(400);
        expect(responseBody).toEqual(mockErrorResponse);
        expect(returnValidationError).toHaveBeenCalledWith(googleSearchPlaceValidate.errors);
    });

    it("should handle errors from searchLocalities", async () => {
        const errorMessage = "Failed to search localities";

        googleSearchPlaceValidate.mockReturnValue(true);
        searchLocalities.mockRejectedValue({ message: errorMessage, status: 500 });

        const request = {
            json: jest.fn().mockResolvedValue({ placeType: "locality", textQuery: "test" }),
        };

        const response = await POST(request);
        const responseBody = await response.json();

        expect(response.status).toBe(500);
        expect(responseBody).toEqual({ error: errorMessage });
    });

    it("should handle errors from searchPlaces", async () => {
        const errorMessage = "Failed to search places";

        googleSearchPlaceValidate.mockReturnValue(true);
        isValidLatitude.mockReturnValue(true);
        isValidLongitude.mockReturnValue(true);
        searchPlaces.mockRejectedValue({ message: errorMessage, status: 500 });

        const request = {
            json: jest.fn().mockResolvedValue({
                placeType: "place",
                textQuery: "test",
                latitude: 40.7128,
                longitude: -74.006,
            }),
        };

        const response = await POST(request);
        const responseBody = await response.json();

        expect(response.status).toBe(500);
        expect(responseBody).toEqual({ error: errorMessage });
    });
});
