/**
 * @jest-environment node
 */

import { isOwnerOrAdmin, isPublicOrSharedWith } from "@/lib/authMiddleware";
const GuideService = require("@/services/GuideService");
const GuideShareService = require("@/services/GuideShareService");
const { commonAfterAll } = require("../testCommon");

jest.mock("@/services/GuideService", () => ({
    getGuideById: jest.fn(),
}));

jest.mock("@/services/GuideShareService", () => ({
    getGuidesBySharedUserId: jest.fn(),
}));

afterAll(commonAfterAll);

describe("authMiddlware", () => {
    describe("isOwnerOrAdmin", () => {
        const user = { id: 1, isAdmin: false };

        beforeEach(() => {
            jest.clearAllMocks();
        });

        it("should return false if user is not provided", async () => {
            const result = await isOwnerOrAdmin(null, 1, "guide");
            expect(result).toBe(false);
        });

        it("should return false if itemId is not a valid number", async () => {
            const result = await isOwnerOrAdmin(user, "invalid", "guide");
            expect(result).toBe(false);
        });

        it("should return false if itemType is 'guide' and user is not the owner", async () => {
            GuideService.getGuideById.mockResolvedValue({ authorId: 2 });
            const result = await isOwnerOrAdmin(user, 1, "guide");
            expect(result).toBe(false);
        });

        it("should return true if itemType is 'guide' and user is the owner", async () => {
            GuideService.getGuideById.mockResolvedValue({ authorId: 1 });
            const result = await isOwnerOrAdmin(user, 1, "guide");
            expect(result).toBe(true);
        });

        it("should return true if user is admin", async () => {
            const adminUser = { id: 2, isAdmin: true };
            const result = await isOwnerOrAdmin(adminUser, 1, "guide");
            expect(result).toBe(true);
        });

        it("should return true if itemType is 'profile' and user is the owner", async () => {
            const result = await isOwnerOrAdmin(user, 1, "profile");
            expect(result).toBe(true);
        });

        it("should return false if itemType is 'profile' and user is not the owner", async () => {
            const result = await isOwnerOrAdmin(user, 2, "profile");
            expect(result).toBe(false);
        });

        it("should return false if itemType is not 'guide' or 'profile'", async () => {
            const result = await isOwnerOrAdmin(user, 1, "unknown");
            expect(result).toBe(false);
        });
    });

    describe("isPublicOrSharedWith", () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        it("should return true if the guide is public and no user is provided", async () => {
            GuideService.getGuideById.mockResolvedValue({ id: 1, isPrivate: false });

            const result = await isPublicOrSharedWith(null, 1);
            expect(result).toBe(true);
        });

        it("should return false if the guide is private and no user is provided", async () => {
            GuideService.getGuideById.mockResolvedValue({ id: 1, isPrivate: true });

            const result = await isPublicOrSharedWith(null, 1);
            expect(result).toBe(false);
        });

        it("should return true if the user is an admin", async () => {
            const user = { id: 1, isAdmin: true };
            GuideService.getGuideById.mockResolvedValue({ id: 1, isPrivate: true });

            const result = await isPublicOrSharedWith(user, 1);
            expect(result).toBe(true);
        });

        it("should return true if the user is the author of the guide", async () => {
            const user = { id: 1, isAdmin: false };
            GuideService.getGuideById.mockResolvedValue({ id: 1, isPrivate: true });
            GuideShareService.getGuidesBySharedUserId.mockResolvedValue([]);
            GuideService.getGuideById.mockResolvedValue({ id: 1, isPrivate: true, authorId: 1 });

            const result = await isPublicOrSharedWith(user, 1);
            expect(result).toBe(true);
        });

        it("should return true if the guide is shared with the user", async () => {
            const user = { id: 1, isAdmin: false };
            GuideService.getGuideById.mockResolvedValue({ id: 1, isPrivate: true });
            GuideShareService.getGuidesBySharedUserId.mockResolvedValue([{ id: 1 }]);

            const result = await isPublicOrSharedWith(user, 1);
            expect(result).toBe(true);
        });

        it("should return false if the guide is private and not shared with the user", async () => {
            const user = { id: 1, isAdmin: false };
            GuideService.getGuideById.mockResolvedValue({ id: 1, isPrivate: true });
            GuideShareService.getGuidesBySharedUserId.mockResolvedValue([{ id: 2 }]);

            const result = await isPublicOrSharedWith(user, 1);
            expect(result).toBe(false);
        });

        it("should return true if the guide is public and shared with the user", async () => {
            const user = { id: 1, isAdmin: false };
            GuideService.getGuideById.mockResolvedValue({ id: 1, isPrivate: false });
            GuideShareService.getGuidesBySharedUserId.mockResolvedValue([{ id: 1 }]);

            const result = await isPublicOrSharedWith(user, 1);
            expect(result).toBe(true);
        });
    });
});
