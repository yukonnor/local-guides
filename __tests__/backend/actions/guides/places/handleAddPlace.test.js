/**
 * @jest-environment node
 */

import { handleAddPlace } from "@/app/actions/guides/places/handleAddPlace";
import GuidePlaceService from "@/services/GuidePlaceService";
import { createToastCookie } from "@/app/actions/cookieActions";
import { redirect } from "next/navigation";
const { commonAfterAll } = require("../../../testCommon");

// Mock the GuidePlaceService methods and createToastCookie
jest.mock("@/services/GuidePlaceService", () => ({
    addGuidePlace: jest.fn(),
}));

jest.mock("@/app/actions/cookieActions", () => ({
    createToastCookie: jest.fn(),
}));

jest.mock("next/navigation", () => ({
    redirect: jest.fn(),
}));

afterAll(commonAfterAll);

describe("handleAddPlace", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should successfully add a place and redirect", async () => {
        const guideId = "guide123";
        const gpId = "place456";
        const formData = new FormData();
        formData.append("description", "A great place to visit!");
        formData.append("recType", "restaurant");

        const mockPlaceResult = { id: "newPlaceId" };

        GuidePlaceService.addGuidePlace.mockResolvedValue(mockPlaceResult);
        createToastCookie.mockResolvedValue(); // Assuming createToastCookie returns a promise

        await handleAddPlace(guideId, gpId, formData);

        expect(GuidePlaceService.addGuidePlace).toHaveBeenCalledWith(guideId, {
            googlePlaceId: gpId,
            description: "A great place to visit!",
            recType: "restaurant",
        });
        // expect(createToastCookie).toHaveBeenCalledWith("success", "Successfully added place.");
        expect(redirect).toHaveBeenCalledWith(`/guides/${guideId}`);
    });

    it("should handle errors and create error toast cookie", async () => {
        const guideId = "guide123";
        const gpId = "place456";
        const formData = new FormData();
        formData.append("description", "A great place to visit!");
        formData.append("recType", "restaurant");

        const error = new Error("Failed to add place");

        GuidePlaceService.addGuidePlace.mockRejectedValue(error);
        createToastCookie.mockResolvedValue(); // Assuming createToastCookie returns a promise

        await handleAddPlace(guideId, gpId, formData);

        expect(GuidePlaceService.addGuidePlace).toHaveBeenCalledWith(guideId, {
            googlePlaceId: gpId,
            description: "A great place to visit!",
            recType: "restaurant",
        });
        expect(createToastCookie).toHaveBeenCalledWith("error", error.message);
        expect(redirect).not.toHaveBeenCalled();
    });
});
