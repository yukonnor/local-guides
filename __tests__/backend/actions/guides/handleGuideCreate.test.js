/**
 * @jest-environment node
 */

import { handleGuideCreate } from "@/app/actions/guides/handleGuideCreate";
import GuideService from "@/services/GuideService";
import { getPlaceData } from "@/lib/api/googlePlaces";
import { createToastCookie } from "@/app/actions/cookieActions";
import { redirect } from "next/navigation";
const { commonAfterAll } = require("../../testCommon");

// Mock the imported functions
jest.mock("@/services/GuideService", () => ({
    addGuide: jest.fn(),
}));

jest.mock("@/lib/api/googlePlaces", () => ({
    getPlaceData: jest.fn(),
}));

jest.mock("@/app/actions/cookieActions", () => ({
    createToastCookie: jest.fn(),
}));

jest.mock("next/navigation", () => ({
    redirect: jest.fn(),
}));

afterAll(commonAfterAll);

describe("handleGuideCreate", () => {
    const userId = "user123";
    const gpId = "place456";
    let formData;

    beforeEach(() => {
        jest.clearAllMocks();
        formData = new Map();
    });

    it("should create an error toast if the title is missing", async () => {
        formData.set("title", "");
        formData.set("isPrivate", "true");

        await handleGuideCreate(userId, gpId, formData);

        expect(createToastCookie).toHaveBeenCalledWith("error", "Provide a title for your guide.");
        expect(getPlaceData).not.toHaveBeenCalled();
        expect(GuideService.addGuide).not.toHaveBeenCalled();
        expect(redirect).not.toHaveBeenCalled();
    });

    it("should create a guide and create a success toast, then redirect", async () => {
        formData.set("title", "New Guide");
        formData.set("isPrivate", "true");

        getPlaceData.mockResolvedValue({
            location: { latitude: 10, longitude: 20 },
        });
        const newGuide = { id: "guide789" };
        GuideService.addGuide.mockResolvedValue(newGuide);

        await handleGuideCreate(userId, gpId, formData);

        expect(getPlaceData).toHaveBeenCalledWith(gpId);
        expect(GuideService.addGuide).toHaveBeenCalledWith({
            authorId: userId,
            googlePlaceId: gpId,
            title: "New Guide",
            isPrivate: true,
            latitude: 10,
            longitude: 20,
        });
        expect(createToastCookie).toHaveBeenCalledWith("success", "Successfully created guide.");
        expect(redirect).toHaveBeenCalledWith(`/guides/${newGuide.id}`);
    });

    it("should log an error, create an error toast, and not redirect on failure", async () => {
        formData.set("title", "New Guide");
        formData.set("isPrivate", "true");

        const error = new Error("Failed to create guide");
        getPlaceData.mockRejectedValue(error);

        await handleGuideCreate(userId, gpId, formData);

        expect(getPlaceData).toHaveBeenCalledWith(gpId);
        expect(GuideService.addGuide).not.toHaveBeenCalled();
        expect(createToastCookie).toHaveBeenCalledWith("error", error.message);
        expect(redirect).not.toHaveBeenCalled();
    });
});
