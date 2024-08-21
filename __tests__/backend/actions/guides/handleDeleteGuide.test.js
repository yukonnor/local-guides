/**
 * @jest-environment node
 */

import { handleDeleteGuide } from "@/app/actions/guides/handleDeleteGuide";
import GuideService from "@/services/GuideService";
import { createToastCookie } from "@/app/actions/cookieActions";
import { redirect } from "next/navigation";
const { commonAfterAll } = require("../../testCommon");

// Mock the imported functions
jest.mock("@/services/GuideService", () => ({
    deleteGuide: jest.fn(),
}));

jest.mock("@/app/actions/cookieActions", () => ({
    createToastCookie: jest.fn(),
}));

jest.mock("next/navigation", () => ({
    redirect: jest.fn(),
}));

afterAll(commonAfterAll);

describe("handleDeleteGuide", () => {
    const guideId = "guide123";

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should delete the guide and create a success toast, then redirect", async () => {
        GuideService.deleteGuide.mockResolvedValue({ id: guideId });

        await handleDeleteGuide(guideId);

        expect(GuideService.deleteGuide).toHaveBeenCalledWith(guideId);
        expect(createToastCookie).toHaveBeenCalledWith("success", "Successfully deleted guide.");
        expect(redirect).toHaveBeenCalledWith(`/`);
    });

    it("should log an error, create an error toast, and not redirect on failure", async () => {
        const error = new Error("Failed to delete guide");
        GuideService.deleteGuide.mockRejectedValue(error);

        await handleDeleteGuide(guideId);

        expect(GuideService.deleteGuide).toHaveBeenCalledWith(guideId);
        expect(createToastCookie).toHaveBeenCalledWith("error", error.message);
        expect(redirect).not.toHaveBeenCalled();
    });
});
