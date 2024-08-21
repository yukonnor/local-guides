/**
 * @jest-environment node
 */

import { handleDeletePlace } from "@/app/actions/guides/places/handleDeletePlace";
import GuidePlaceService from "@/services/GuidePlaceService";
const { commonAfterAll } = require("../../../testCommon");

// Mock the GuidePlaceService methods
jest.mock("@/services/GuidePlaceService", () => ({
    deleteGuidePlace: jest.fn(),
}));

afterAll(commonAfterAll);

describe("handleDeletePlace", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should successfully delete a place", async () => {
        const placeId = "place123";
        const mockResponse = { success: true };

        GuidePlaceService.deleteGuidePlace.mockResolvedValue(mockResponse);

        const result = await handleDeletePlace(placeId);

        expect(GuidePlaceService.deleteGuidePlace).toHaveBeenCalledWith(placeId);
        expect(result).toEqual(mockResponse);
    });

    it("should handle errors when deleting a place", async () => {
        const placeId = "place123";
        const error = new Error("Failed to delete place");

        GuidePlaceService.deleteGuidePlace.mockRejectedValue(error);

        await expect(handleDeletePlace(placeId)).rejects.toThrow(error);

        expect(GuidePlaceService.deleteGuidePlace).toHaveBeenCalledWith(placeId);
    });
});
