/**
 * @jest-environment node
 */

const GuideShareService = require("@/services/GuideShareService");
const User = require("@/models/User");
const Guide = require("@/models/Guide");
const GuideShare = require("@/models/GuideShare");
const { AppError, NotFoundError, BadRequestError } = require("../../../src/utils/errors");
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

describe("GuideShare Service", () => {
    beforeEach(() => {
        jest.restoreAllMocks();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("getGuideShares", () => {
        it("should return all guide shares", async () => {
            const result = await GuideShareService.getGuideShares();

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
            const result = await GuideShareService.getGuideShares(1, 0);

            expect(result.length).toEqual(1);
        });

        it("should throw AppError if no guide shares found", async () => {
            jest.spyOn(GuideShare, "getAll").mockResolvedValue([]);

            await expect(GuideShareService.getGuideShares()).rejects.toThrow(AppError);
        });

        it("should rethrow whatever error came from model method", async () => {
            jest.spyOn(GuideShare, "getAll").mockRejectedValue(
                new BadRequestError("A bad request")
            );

            await expect(GuideShareService.getGuideShares()).rejects.toThrow(BadRequestError);
        });
    });

    describe("getSharesByGuideId", () => {
        it("should return guide shares for a specific guide id", async () => {
            const guideShares = await GuideShare.getAll();
            const result = await GuideShareService.getSharesByGuideId(guideShares[0].guideId);

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

        it("should rethrow whatever error came from model method", async () => {
            jest.spyOn(GuideShare, "getSharesByGuideId").mockRejectedValue(
                new BadRequestError("A bad request")
            );

            await expect(GuideShareService.getSharesByGuideId()).rejects.toThrow(BadRequestError);
        });

        it("should throw an App Error if an unspecified issue occurred", async () => {
            jest.spyOn(GuideShare, "getSharesByGuideId").mockRejectedValue(
                new Error("A random error")
            );

            await expect(GuideShareService.getSharesByGuideId()).rejects.toThrow(AppError);
        });
    });

    describe("getGuidesBySharedUserId", () => {
        it("should return guide shares associated with a user", async () => {
            const user = await User.getByUsername("testviewer");
            const result = await GuideShareService.getGuidesBySharedUserId(user.id);

            expect(result.length).toEqual(1);
            expect(result[0]).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                })
            );
        });

        it("should rethrow whatever error came from model method", async () => {
            jest.spyOn(GuideShare, "getGuidesBySharedUserId").mockRejectedValue(
                new BadRequestError("A bad request")
            );

            await expect(GuideShareService.getGuidesBySharedUserId(1)).rejects.toThrow(
                BadRequestError
            );
        });

        it("should throw an App Error if an unspecified issue occurred", async () => {
            jest.spyOn(GuideShare, "getGuidesBySharedUserId").mockRejectedValue(
                new Error("A random error")
            );

            await expect(GuideShareService.getGuidesBySharedUserId(1)).rejects.toThrow(AppError);
        });
    });

    describe("addShareToGuide", () => {
        it("should create a guide share", async () => {
            const guides = await Guide.getAll();
            const result = await GuideShareService.addShareToGuide(
                guides[0].id,
                "newemail@example.com"
            );

            expect(result).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                    guideId: expect.any(Number),
                    email: "newemail@example.com",
                    createdAt: expect.any(Object),
                })
            );
        });

        it("should throw a BadRequest error if email is an empty string", async () => {
            await expect(GuideShareService.addShareToGuide(1, "")).rejects.toThrow(BadRequestError);
        });

        it("should rethrow whatever error came from model method", async () => {
            jest.spyOn(GuideShare, "create").mockRejectedValue(
                new BadRequestError("A bad request")
            );

            await expect(
                GuideShareService.addShareToGuide(1, "newemail@example.com")
            ).rejects.toThrow(BadRequestError);
        });

        it("should throw an App Error if an unspecified issue occurred", async () => {
            jest.spyOn(GuideShare, "create").mockRejectedValue(new Error("A random error"));

            await expect(
                GuideShareService.addShareToGuide(1, "newemail@example.com")
            ).rejects.toThrow(AppError);
        });
    });

    describe("deleteShareFromGuide", () => {
        it("should delete a guide share", async () => {
            const guideShares = await GuideShare.getAll();
            const result = await GuideShareService.deleteShareFromGuide(
                guideShares[0].id,
                guideShares[0].guideId
            );

            expect(result).toEqual(
                expect.objectContaining({
                    id: guideShares[0].id,
                })
            );
        });

        it("should rethrow whatever error came from model method", async () => {
            jest.spyOn(GuideShare, "delete").mockRejectedValue(
                new BadRequestError("A bad request")
            );

            await expect(GuideShareService.deleteShareFromGuide(1)).rejects.toThrow(
                BadRequestError
            );
        });

        it("should throw an App Error if an unspecified issue occurred", async () => {
            jest.spyOn(GuideShare, "delete").mockRejectedValue(new Error("A random error"));

            await expect(GuideShareService.deleteShareFromGuide(1)).rejects.toThrow(AppError);
        });
    });
});
