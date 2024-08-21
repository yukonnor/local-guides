/**
 * @jest-environment node
 */

import { GET } from "@/app/api/google/place/[id]/route.js";
import { getPlaceData } from "@/lib/api/googlePlaces";
import { AppError } from "@/utils/errors";
import { commonAfterAll } from "../testCommon";

jest.mock("@/lib/api/googlePlaces", () => ({
    getPlaceData: jest.fn(),
}));

afterAll(commonAfterAll);

describe("GET /api/google/place/[id]", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return place data on successful retrieval", async () => {
        const mockPlaceData = { name: "Test Place", location: "Test Location" };

        getPlaceData.mockResolvedValue(mockPlaceData);

        const request = {
            json: jest.fn().mockResolvedValue({}), // No request body for GET
        };

        const params = { id: "123" };
        const response = await GET(request, { params });
        const responseBody = await response.json();

        expect(response.status).toBe(200);
        expect(responseBody).toEqual(mockPlaceData);
        expect(getPlaceData).toHaveBeenCalledWith("123");
    });

    it("should return an error if getPlaceData fails", async () => {
        const errorMessage = "Failed to retrieve place data";
        const errorStatus = 500;

        getPlaceData.mockRejectedValue({ message: errorMessage, status: errorStatus });

        const request = {
            json: jest.fn().mockResolvedValue({}), // No request body for GET
        };

        const params = { id: "123" };
        const response = await GET(request, { params });
        const responseBody = await response.json();

        expect(response.status).toBe(errorStatus);
        expect(responseBody).toEqual({ error: errorMessage });
    });

    it("should handle unexpected errors from getPlaceData", async () => {
        const unexpectedError = new AppError("Unexpected error");

        getPlaceData.mockRejectedValue(unexpectedError);

        const request = {
            json: jest.fn().mockResolvedValue({}), // No request body for GET
        };

        const params = { id: "123" };
        const response = await GET(request, { params });
        const responseBody = await response.json();

        expect(response.status).toBe(500);
        expect(responseBody).toEqual({ error: "Unexpected error" });
    });
});
