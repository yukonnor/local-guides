/**
 * @jest-environment node
 */

import { handleEditGuide } from "@/app/actions/guides/handleEditGuide";
import GuideService from "@/services/GuideService";
import { createToastCookie } from "@/app/actions/cookieActions";
import { redirect } from "next/navigation";
const { commonAfterAll } = require("../../testCommon");

// Mock the imported functions
jest.mock("@/services/GuideService", () => ({
    updateGuide: jest.fn(),
}));

jest.mock("@/app/actions/cookieActions", () => ({
    createToastCookie: jest.fn(),
}));

jest.mock("next/navigation", () => ({
    redirect: jest.fn(),
}));

afterAll(commonAfterAll);

describe("handleEditGuide", () => {
    const guideId = "guide123";
    let formData;

    beforeEach(() => {
        jest.clearAllMocks();
        formData = new Map();
    });

    it("should create an error toast if the title is missing", async () => {
        formData.set("title", "");
        formData.set("description", "A cool guide");
        formData.set("isPrivate", "true");

        await handleEditGuide(guideId, formData);

        expect(createToastCookie).toHaveBeenCalledWith("error", "Provide a title for your guide.");
        expect(GuideService.updateGuide).not.toHaveBeenCalled();
        expect(redirect).not.toHaveBeenCalled();
    });

    it("should edit the guide and create a success toast, then redirect", async () => {
        formData.set("title", "New Title");
        formData.set("description", "Updated description");
        formData.set("isPrivate", "true");

        GuideService.updateGuide.mockResolvedValue({ id: guideId });

        await handleEditGuide(guideId, formData);

        expect(GuideService.updateGuide).toHaveBeenCalledWith(guideId, {
            title: "New Title",
            description: "Updated description",
            isPrivate: true,
        });
        // expect(createToastCookie).toHaveBeenCalledWith("success", "Successfully edited guide.");
        expect(redirect).toHaveBeenCalledWith(`/guides/${guideId}`);
    });

    it("should log an error, create an error toast, and not redirect on failure", async () => {
        formData.set("title", "New Title");
        formData.set("description", "Updated description");
        formData.set("isPrivate", "true");

        const error = new Error("Failed to edit guide");
        GuideService.updateGuide.mockRejectedValue(error);

        await handleEditGuide(guideId, formData);

        expect(GuideService.updateGuide).toHaveBeenCalledWith(guideId, {
            title: "New Title",
            description: "Updated description",
            isPrivate: true,
        });
        expect(createToastCookie).toHaveBeenCalledWith("error", error.message);
        expect(redirect).not.toHaveBeenCalled();
    });
});
