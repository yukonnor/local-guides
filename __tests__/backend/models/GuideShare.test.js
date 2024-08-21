/**
 * @jest-environment node
 */

const db = require("@/lib/db");
const GuideShare = require("@/models/GuideShare");
const User = require("@/models/User");
const Guide = require("@/models/Guide");
const { NotFoundError, BadRequestError, DatabaseError } = require("@/utils/errors");
const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
} = require("../testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("GuideShare Model", () => {
    beforeEach(() => {
        jest.restoreAllMocks();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("getAll", () => {
        it("should return all guide shares", async () => {
            const result = await GuideShare.getAll();

            expect(result.length).toEqual(2);
            expect(result[0]).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                    guideId: expect.any(Number),
                    email: "testadmin@example.com",
                    createdAt: expect.any(Object),
                })
            );
        });

        it("should limit guide share results", async () => {
            const result = await GuideShare.getAll(1, 0);

            expect(result.length).toEqual(1);
        });
    });

    describe("getSharesByGuideId", () => {
        it("should get guide shares by a guide id", async () => {
            const shares = await GuideShare.getAll();
            const result = await GuideShare.getSharesByGuideId(shares[0].guideId);

            expect(result.length).toEqual(2);
            expect(result[0]).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                    email: "testadmin@example.com",
                    userId: expect.any(Number),
                    username: "testadmin",
                })
            );
        });

        it("should return a NotFound error if guide doesn't exist", async () => {
            jest.spyOn(GuideShare, "checkIfGuideExists").mockImplementation(() => {
                throw new NotFoundError("Guide not found");
            });

            await expect(GuideShare.getSharesByGuideId(0)).rejects.toThrow(NotFoundError);
        });
    });

    describe("getGuidesBySharedUserId", () => {
        it("should get guides shared with a user", async () => {
            const user = await User.getByUsername("testviewer");
            const result = await GuideShare.getGuidesBySharedUserId(user.id);

            expect(result.length).toEqual(1);
            expect(result[0]).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                })
            );
        });

        it("should return a NotFound error if user doesn't exist", async () => {
            jest.spyOn(GuideShare, "checkIfUserExists").mockImplementation(() => {
                throw new NotFoundError("Guide not found");
            });

            await expect(GuideShare.getGuidesBySharedUserId(0)).rejects.toThrow(NotFoundError);
        });
    });

    describe("create", () => {
        it("should create a guide share", async () => {
            const guide = await Guide.getAll();
            const result = await GuideShare.create(guide[0].id, "testemail@example.com");

            expect(result).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                    guideId: expect.any(Number),
                    email: "testemail@example.com",
                    createdAt: expect.any(Object),
                })
            );
        });

        it("should return a BadRequest error if already shared with that email", async () => {
            jest.spyOn(GuideShare, "checkForDuplicateShare").mockImplementation(() => {
                throw new BadRequestError("Duplicate guide share.");
            });

            await expect(GuideShare.create(1, "testviewer@example.com")).rejects.toThrow(
                BadRequestError
            );
        });

        it("should return a NotFound error if guide doesn't exist", async () => {
            jest.spyOn(GuideShare, "checkIfGuideExists").mockImplementation(() => {
                throw new NotFoundError("Guide share doesn't exist.");
            });

            await expect(GuideShare.create(0, "new@example.com")).rejects.toThrow(NotFoundError);
        });

        it("should return a BadRequest error if guide doesn't exist", async () => {
            jest.spyOn(GuideShare, "checkIfSharingWithAuthor").mockImplementation(() => {
                throw new BadRequestError("Guide doesn't exist.");
            });

            await expect(GuideShare.create(1, "testuser@example.com")).rejects.toThrow(
                BadRequestError
            );
        });
    });

    describe("delete", () => {
        it("should delete a guide share", async () => {
            const shares = await GuideShare.getAll();
            const result = await GuideShare.delete(shares[0].id, shares[0].guideId);

            expect(result).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                })
            );
        });

        it("should return a NotFound error if guide share exist", async () => {
            jest.spyOn(GuideShare, "checkIfGuideShareExists").mockImplementation(() => {
                throw new NotFoundError("Guide share not found");
            });

            await expect(GuideShare.delete(0, 0)).rejects.toThrow(NotFoundError);
        });
    });

    describe("checkForDuplicateShare", () => {
        it("should return undefined if not a duplicate guide share", async () => {
            const result = await GuideShare.checkForDuplicateShare(1, "fake@example.com");

            expect(result).toEqual(undefined);
        });

        it("should return a BadRequestError error if duplicate guide share", async () => {
            const shares = await GuideShare.getAll();
            await expect(
                GuideShare.checkForDuplicateShare(shares[0].guideId, shares[0].email)
            ).rejects.toThrow(BadRequestError);
        });
    });

    describe("checkIfGuideExists", () => {
        it("should return undefined if guide exists", async () => {
            const shares = await GuideShare.getAll();
            const result = await GuideShare.checkIfGuideExists(shares[0].guideId);

            expect(result).toEqual(undefined);
        });

        it("should return a NotFound error if guide share doesn't exist", async () => {
            await expect(GuideShare.checkIfGuideExists(0)).rejects.toThrow(NotFoundError);
        });
    });

    describe("checkIfGuideShareExists", () => {
        it("should return undefined if user exists", async () => {
            const shares = await GuideShare.getAll();
            const result = await GuideShare.checkIfGuideShareExists(
                shares[0].id,
                shares[0].guideId
            );

            expect(result).toEqual(undefined);
        });

        it("should return a NotFound error if guide share doesn't exist", async () => {
            await expect(GuideShare.checkIfGuideShareExists(0, 1)).rejects.toThrow(NotFoundError);
        });
    });

    describe("checkIfUserExists", () => {
        it("should return undefined if user exists", async () => {
            const users = await User.getAll();
            const result = await GuideShare.checkIfUserExists(users[0].id);

            expect(result).toEqual(undefined);
        });

        it("should return a NotFound error if user doesn't exist", async () => {
            await expect(GuideShare.checkIfUserExists(0)).rejects.toThrow(NotFoundError);
        });
    });

    describe("checkIfSharingWithAuthor", () => {
        it("should return undefined if guide shared with diff email", async () => {
            const guides = await Guide.getAll();
            const result = await GuideShare.checkIfSharingWithAuthor(
                guides[0].id,
                "foobar@example.com"
            );

            expect(result).toEqual(undefined);
        });

        it("should return a BadRequestError if sharing with author", async () => {
            const guides = await Guide.getAll();
            await expect(
                GuideShare.checkIfSharingWithAuthor(guides[0].id, "testuser@example.com")
            ).rejects.toThrow(BadRequestError);
        });
    });
});
