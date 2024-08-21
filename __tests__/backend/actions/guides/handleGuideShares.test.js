/**
 * @jest-environment node
 */

import { handleShareGuide, handleDeleteShare } from "@/app/actions/guides/handleGuideShares";
import GuideShareService from "@/services/GuideShareService";
const { commonAfterAll } = require("../../testCommon");

// Mock the GuideShareService methods
jest.mock("@/services/GuideShareService", () => ({
    addShareToGuide: jest.fn(),
    deleteShareFromGuide: jest.fn(),
}));

afterAll(commonAfterAll);

describe("Guide Share Actions", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("handleShareGuide", () => {
        it("should successfully share a guide and return the result", async () => {
            const guideId = "guide123";
            const email = "user@example.com";
            const mockShareResult = { success: true };

            GuideShareService.addShareToGuide.mockResolvedValue(mockShareResult);

            const result = await handleShareGuide(guideId, email);

            expect(GuideShareService.addShareToGuide).toHaveBeenCalledWith(guideId, email);
            expect(result).toEqual(mockShareResult);
        });

        it("should log an error and rethrow the error on failure", async () => {
            const guideId = "guide123";
            const email = "user@example.com";
            const error = new Error("Failed to share guide");

            GuideShareService.addShareToGuide.mockRejectedValue(error);

            await expect(handleShareGuide(guideId, email)).rejects.toThrow(error);
            expect(GuideShareService.addShareToGuide).toHaveBeenCalledWith(guideId, email);
        });
    });

    describe("handleDeleteShare", () => {
        it("should successfully delete a share and return the result", async () => {
            const guideId = "guide123";
            const shareId = "share456";
            const mockDeleteResult = { success: true };

            GuideShareService.deleteShareFromGuide.mockResolvedValue(mockDeleteResult);

            const result = await handleDeleteShare(guideId, shareId);

            expect(GuideShareService.deleteShareFromGuide).toHaveBeenCalledWith(shareId, guideId);
            expect(result).toEqual(mockDeleteResult);
        });

        it("should log an error and rethrow the error on failure", async () => {
            const guideId = "guide123";
            const shareId = "share456";
            const error = new Error("Failed to delete share");

            GuideShareService.deleteShareFromGuide.mockRejectedValue(error);

            await expect(handleDeleteShare(guideId, shareId)).rejects.toThrow(error);
            expect(GuideShareService.deleteShareFromGuide).toHaveBeenCalledWith(shareId, guideId);
        });
    });
});
