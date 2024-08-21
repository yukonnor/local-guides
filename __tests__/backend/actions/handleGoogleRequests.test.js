/**
 * @jest-environment node
 */

import { handleSearchPlace, handleSearchLocality } from "@/app/actions/handleGoogleRequests";
import { searchPlaces, searchLocalities } from "@/lib/api/googlePlaces";
const { commonAfterAll } = require("../testCommon");

// Mock the imported functions
jest.mock("@/lib/api/googlePlaces", () => ({
    searchPlaces: jest.fn(),
    searchLocalities: jest.fn(),
}));

afterAll(commonAfterAll);

describe("handleSearchPlace", () => {
    const searchQuery = "restaurant";
    const lat = 37.7749;
    const long = -122.4194;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return place results on a successful search", async () => {
        const mockResults = [
            { name: "Place 1", location: { lat: 37.7749, lng: -122.4194 } },
            { name: "Place 2", location: { lat: 37.7749, lng: -122.4194 } },
        ];
        searchPlaces.mockResolvedValue(mockResults);

        const result = await handleSearchPlace(searchQuery, lat, long);

        expect(searchPlaces).toHaveBeenCalledWith(searchQuery, lat, long);
        expect(result).toEqual(mockResults);
    });

    it("should log an error and rethrow it on failure", async () => {
        const error = new Error("API error");
        searchPlaces.mockRejectedValue(error);

        await expect(handleSearchPlace(searchQuery, lat, long)).rejects.toThrow(error);
        expect(searchPlaces).toHaveBeenCalledWith(searchQuery, lat, long);
    });
});

describe("handleSearchLocality", () => {
    const searchQuery = "San Francisco";

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return locality results on a successful search", async () => {
        const mockResults = [{ name: "San Francisco", location: { lat: 37.7749, lng: -122.4194 } }];
        searchLocalities.mockResolvedValue(mockResults);

        const result = await handleSearchLocality(searchQuery);

        expect(searchLocalities).toHaveBeenCalledWith(searchQuery);
        expect(result).toEqual(mockResults);
    });

    it("should log an error and rethrow it on failure", async () => {
        const error = new Error("API error");
        searchLocalities.mockRejectedValue(error);

        await expect(handleSearchLocality(searchQuery)).rejects.toThrow(error);
        expect(searchLocalities).toHaveBeenCalledWith(searchQuery);
    });
});
