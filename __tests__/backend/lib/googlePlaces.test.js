/**
 * @jest-environment node
 */

import { searchPlaces, searchLocalities, getPlaceData } from "@/lib/api/googlePlaces";
import { AppError } from "@/utils/errors";
const fetch = require("node-fetch");
const { Response } = jest.requireActual("node-fetch");
import { commonAfterAll } from "../testCommon";

// Mock the fetch function
jest.mock("node-fetch");

// Mock the constants module
jest.mock("@/lib/api/constants", () => ({
    DEFAULT_RADIUS: 5,
    PLACES_FIELDS: "places.name",
    PLACE_FIELDS: "formattedAddress",
    LOCALITIES_FIELDS: "places.formattedAddress",
    LOCALITY_FIELDS: "formattedAddress",
}));

// get the test key from .env.test
const MAPS_API_KEY = process.env.MAPS_API_KEY;

afterAll(commonAfterAll);

describe("googlePlaces API", () => {
    describe("searchPlaces", () => {
        const textQuery = "restaurant";
        const lat = 37.7749;
        const long = -122.4194;
        // includes PLACES_FIELDS: places.name
        const url = `https://places.googleapis.com/v1/places:searchText?fields=places.name&key=${MAPS_API_KEY}`;

        beforeEach(() => {
            jest.resetAllMocks();
        });

        it("should return places on a successful API call", async () => {
            const mockResponse = {
                places: [
                    { name: "Place 1", location: { lat: 37.7749, lng: -122.4194 } },
                    { name: "Place 2", location: { lat: 37.7749, lng: -122.4194 } },
                ],
            };

            fetch.mockResolvedValue(new Response(JSON.stringify(mockResponse), { status: 200 }));

            const result = await searchPlaces(textQuery, lat, long);

            expect(fetch).toHaveBeenCalledWith(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    textQuery,
                    locationBias: {
                        circle: {
                            center: {
                                latitude: lat,
                                longitude: long,
                            },
                            radius: 5, // Use the mocked DEFAULT_RADIUS
                        },
                    },
                }),
            });
            expect(result).toEqual(mockResponse.places);
        });

        it("should throw and AppError if the API call fails", async () => {
            const mockErrorResponse = {
                error: {
                    message: "Invalid request",
                    details: [],
                },
            };

            fetch.mockResolvedValue(
                new Response(JSON.stringify(mockErrorResponse), { status: 400 })
            );

            await expect(searchPlaces(textQuery, lat, long)).rejects.toThrow(AppError);
        });
    });

    describe("searchLocalities", () => {
        const textQuery = "downtown";
        // Based on LOCALITIES_FIELDS: places.formattedAddress
        const url = `https://places.googleapis.com/v1/places:searchText?fields=places.formattedAddress&key=${MAPS_API_KEY}`;

        beforeEach(() => {
            jest.resetAllMocks();
        });

        it("should return localities on a successful API call", async () => {
            const mockResponse = {
                places: [
                    { name: "Locality 1", location: { lat: 37.7749, lng: -122.4194 } },
                    { name: "Locality 2", location: { lat: 37.7749, lng: -122.4194 } },
                ],
            };

            fetch.mockResolvedValue(new Response(JSON.stringify(mockResponse), { status: 200 }));

            const result = await searchLocalities(textQuery);

            expect(fetch).toHaveBeenCalledWith(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    textQuery,
                    includedType: "locality",
                    strictTypeFiltering: true,
                }),
            });
            expect(result).toEqual(mockResponse.places);
        });

        it("should handle errors from the API", async () => {
            const mockErrorResponse = {
                error: {
                    message: "Invalid request",
                    details: [],
                },
            };

            fetch.mockResolvedValue(
                new Response(JSON.stringify(mockErrorResponse), { status: 400 })
            );

            await expect(searchLocalities(textQuery)).rejects.toThrow(AppError);
        });
    });

    describe("getPlaceData", () => {
        const placeId = "ChIJsQwp2L5YpUARH5Jfo97BmcY";
        const type = "place";
        const url = `https://places.googleapis.com/v1/places/${placeId}?fields=formattedAddress&key=${MAPS_API_KEY}`;

        beforeEach(() => {
            jest.resetAllMocks();
        });

        it("should return place data on a successful API call", async () => {
            const mockResponse = {
                name: "Place Name",
                formattedAddress: "123 Main St, Anytown, USA",
            };

            fetch.mockResolvedValue(new Response(JSON.stringify(mockResponse), { status: 200 }));

            const result = await getPlaceData(placeId);

            expect(fetch).toHaveBeenCalledWith(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            expect(result).toEqual(mockResponse);
        });

        it("should handle errors from the API", async () => {
            const mockErrorResponse = {
                error: {
                    message: "Invalid place ID",
                    details: [],
                },
            };

            fetch.mockResolvedValue(
                new Response(JSON.stringify(mockErrorResponse), { status: 400 })
            );

            await expect(getPlaceData(placeId)).rejects.toThrow(AppError);
        });

        it("should handle different types correctly", async () => {
            const type = "locality";
            const urlWithLocalityFields = `https://places.googleapis.com/v1/places/${placeId}?fields=formattedAddress&key=${MAPS_API_KEY}`;

            const mockResponse = {
                name: "Locality Name",
                formattedAddress: "456 Secondary St, Othertown, USA",
            };

            fetch.mockResolvedValue(new Response(JSON.stringify(mockResponse), { status: 200 }));

            const result = await getPlaceData(placeId, type);

            expect(fetch).toHaveBeenCalledWith(urlWithLocalityFields, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            expect(result).toEqual(mockResponse);
        });
    });
});
