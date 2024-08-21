/**
 * @jest-environment node
 */

const GuidePlaceService = require("@/services/GuidePlaceService");
const Guide = require("@/models/Guide");
const GuidePlace = require("@/models/GuidePlace");
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

describe("GuidePlace Service", () => {
    beforeEach(() => {
        jest.restoreAllMocks();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("getGuidePlaces", () => {
        it("should return all guide places", async () => {
            const result = await GuidePlaceService.getGuidePlaces();

            expect(result.length).toEqual(2);
            expect(result[0]).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                    guideId: expect.any(Number),
                    googlePlaceId: expect.any(String),
                    description: "You should check this place out!",
                    recType: "dontmiss",
                    createdAt: expect.any(Object),
                    updatedAt: expect.any(Object),
                    tags: expect.any(Array),
                })
            );
        });

        it("should limit guide place results", async () => {
            const result = await GuidePlaceService.getGuidePlaces(1, 0);

            expect(result.length).toEqual(1);
        });

        it("should throw AppError if no guide places found", async () => {
            jest.spyOn(GuidePlace, "getAll").mockResolvedValue([]);

            await expect(GuidePlaceService.getGuidePlaces()).rejects.toThrow(AppError);
        });

        it("should rethrow whatever error came from model method", async () => {
            jest.spyOn(GuidePlace, "getAll").mockRejectedValue(
                new BadRequestError("A bad request")
            );

            await expect(GuidePlaceService.getGuidePlaces()).rejects.toThrow(BadRequestError);
        });
    });

    describe("getGuidePlaceById", () => {
        it("should return a specific guide place based on id", async () => {
            const guidePlaces = await GuidePlace.getAll();
            const result = await GuidePlaceService.getGuidePlaceById(guidePlaces[0].id);

            expect(result).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                    guideId: expect.any(Number),
                    googlePlaceId: expect.any(String),
                    description: "You should check this place out!",
                    recType: "dontmiss",
                    createdAt: expect.any(Object),
                    updatedAt: expect.any(Object),
                    tags: expect.any(Array),
                })
            );
        });

        it("should return a NotFound error if guide place doesn't exist", async () => {
            await expect(GuidePlaceService.getGuidePlaceById(999)).rejects.toThrow(NotFoundError);
        });

        it("should rethrow whatever error came from model method", async () => {
            jest.spyOn(GuidePlace, "getById").mockRejectedValue(
                new BadRequestError("A bad request")
            );

            await expect(GuidePlaceService.getGuidePlaceById()).rejects.toThrow(BadRequestError);
        });

        it("should throw an App Error if an unspecified issue occurred", async () => {
            jest.spyOn(GuidePlace, "getById").mockRejectedValue(new Error("A random error"));

            await expect(GuidePlaceService.getGuidePlaceById()).rejects.toThrow(AppError);
        });
    });

    describe("getGuidePlacesByGuideId", () => {
        it("should return guide places associated with a guide", async () => {
            const guides = await Guide.getAll();
            const result = await GuidePlaceService.getGuidePlacesByGuideId(guides[0].id);

            expect(result.length).toEqual(2);
            expect(result[0]).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                })
            );
        });

        it("should rethrow whatever error came from model method", async () => {
            jest.spyOn(GuidePlace, "getByGuideId").mockRejectedValue(
                new BadRequestError("A bad request")
            );

            await expect(GuidePlaceService.getGuidePlacesByGuideId(1)).rejects.toThrow(
                BadRequestError
            );
        });

        it("should throw an App Error if an unspecified issue occurred", async () => {
            jest.spyOn(GuidePlace, "getByGuideId").mockRejectedValue(new Error("A random error"));

            await expect(GuidePlaceService.getGuidePlacesByGuideId(1)).rejects.toThrow(AppError);
        });
    });

    describe("addGuidePlace", () => {
        it("should create a guide place", async () => {
            const guides = await Guide.getAll();
            const newPlace = {
                googlePlaceId: "NEWGPLACEID",
                description: "Check out this place.",
                recType: "dontmiss",
            };
            const result = await GuidePlaceService.addGuidePlace(guides[0].id, newPlace);

            expect(result).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                    guideId: expect.any(Number),
                    googlePlaceId: "NEWGPLACEID",
                    description: "Check out this place.",
                    recType: "dontmiss",
                    createdAt: expect.any(Object),
                    updatedAt: expect.any(Object),
                })
            );
        });

        it("should rethrow whatever error came from model method", async () => {
            jest.spyOn(GuidePlace, "create").mockRejectedValue(
                new BadRequestError("A bad request")
            );

            await expect(GuidePlaceService.addGuidePlace()).rejects.toThrow(BadRequestError);
        });

        it("should throw an App Error if an unspecified issue occurred", async () => {
            jest.spyOn(GuidePlace, "create").mockRejectedValue(new Error("A random error"));

            await expect(GuidePlaceService.addGuidePlace()).rejects.toThrow(AppError);
        });
    });

    describe("updateGuidePlace", () => {
        const PLACE_DATA = {
            description: "New description.",
            recType: "avoid",
        };

        it("should update a guide place", async () => {
            const guidePlaces = await GuidePlace.getAll();
            const result = await GuidePlaceService.updateGuidePlace(guidePlaces[0].id, PLACE_DATA);

            expect(result).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                    guideId: expect.any(Number),
                    googlePlaceId: expect.any(String),
                    description: PLACE_DATA.description,
                    recType: PLACE_DATA.recType,
                    createdAt: expect.any(Object),
                    updatedAt: expect.any(Object),
                })
            );
        });

        it("should rethrow whatever error came from model method", async () => {
            jest.spyOn(GuidePlace, "update").mockRejectedValue(
                new BadRequestError("A bad request")
            );

            await expect(GuidePlaceService.updateGuidePlace(1, PLACE_DATA)).rejects.toThrow(
                BadRequestError
            );
        });

        it("should throw an App Error if an unspecified issue occurred", async () => {
            jest.spyOn(GuidePlace, "update").mockRejectedValue(new Error("A random error"));

            await expect(GuidePlaceService.updateGuidePlace(1, PLACE_DATA)).rejects.toThrow(
                AppError
            );
        });
    });

    describe("deleteGuidePlace", () => {
        it("should delete a guide place", async () => {
            const guidePlaces = await GuidePlace.getAll();
            const result = await GuidePlaceService.deleteGuidePlace(guidePlaces[0].id);

            expect(result).toEqual(
                expect.objectContaining({
                    id: guidePlaces[0].id,
                })
            );
        });

        it("should rethrow whatever error came from model method", async () => {
            jest.spyOn(GuidePlace, "delete").mockRejectedValue(
                new BadRequestError("A bad request")
            );

            await expect(GuidePlaceService.deleteGuidePlace(1)).rejects.toThrow(BadRequestError);
        });

        it("should throw an App Error if an unspecified issue occurred", async () => {
            jest.spyOn(GuidePlace, "delete").mockRejectedValue(new Error("A random error"));

            await expect(GuidePlaceService.deleteGuidePlace(1)).rejects.toThrow(AppError);
        });
    });
});
