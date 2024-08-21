/**
 * @jest-environment node
 */

const GuideService = require("@/services/GuideService");
const Guide = require("@/models/Guide");
const User = require("@/models/User");
const { AppError, NotFoundError, BadRequestError } = require("../../../src/utils/errors");
const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
} = require("../testCommon");

const LAT = 37.7749;
const LONG = -122.4194;
const GOOGLE_PLACE_ID = "ChIJIQBpAG2ahYAR_6128GcTUEo";

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("Guide Service", () => {
    beforeEach(() => {
        jest.restoreAllMocks();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("getAll", () => {
        it("should return all guides", async () => {
            const result = await GuideService.getGuides();

            expect(result.length).toEqual(4);
            expect(result[0]).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                    authorId: expect.any(Number),
                    googlePlaceId: GOOGLE_PLACE_ID,
                    title: "Test Guide: San Francisco",
                    isPrivate: false,
                    latitude: LAT,
                    longitude: LONG,
                    description: "A guide for San Francisco",
                    createdAt: expect.any(Object),
                    updatedAt: expect.any(Object),
                })
            );
        });

        it("should limit guide results", async () => {
            const result = await GuideService.getGuides(1, 0);

            expect(result.length).toEqual(1);
        });

        it("should throw AppError if no guides found", async () => {
            jest.spyOn(Guide, "getAll").mockResolvedValue([]);

            await expect(GuideService.getGuides()).rejects.toThrow(AppError);
        });

        it("should rethrow whatever error came from model method", async () => {
            jest.spyOn(Guide, "getAll").mockRejectedValue(new BadRequestError("A bad request"));

            await expect(GuideService.getGuides()).rejects.toThrow(BadRequestError);
        });
    });

    describe("getGuideById", () => {
        it("should return a specific guide based on id", async () => {
            const guides = await GuideService.getGuides();
            const result = await GuideService.getGuideById(guides[0].id);

            expect(result).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                    authorId: expect.any(Number),
                    googlePlaceId: GOOGLE_PLACE_ID,
                    title: "Test Guide: San Francisco",
                    isPrivate: false,
                    latitude: LAT,
                    longitude: LONG,
                    description: "A guide for San Francisco",
                    createdAt: expect.any(Object),
                    updatedAt: expect.any(Object),
                    places: expect.any(Array),
                })
            );
        });

        it("should return a NotFound error if guide id doesn't exist", async () => {
            await expect(GuideService.getGuideById(999)).rejects.toThrow(NotFoundError);
        });

        it("should rethrow whatever error came from model method", async () => {
            jest.spyOn(Guide, "getById").mockRejectedValue(new BadRequestError("A bad request"));

            await expect(GuideService.getGuideById()).rejects.toThrow(BadRequestError);
        });

        it("should throw an App Error if an unspecified issue occurred", async () => {
            jest.spyOn(Guide, "getById").mockRejectedValue(new Error("A random error"));

            await expect(GuideService.getGuideById()).rejects.toThrow(AppError);
        });
    });

    describe("getGuideByAuthorId", () => {
        it("should return guides associated with a given user id", async () => {
            const user = await User.getByUsername("testauthor");
            const result = await GuideService.getGuideByAuthorId(user.id);

            expect(result.length).toEqual(4);
            expect(result[0]).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                    authorId: expect.any(Number),
                    googlePlaceId: GOOGLE_PLACE_ID,
                    title: "Test Guide: San Francisco",
                    isPrivate: false,
                    latitude: LAT,
                    longitude: LONG,
                    description: "A guide for San Francisco",
                    createdAt: expect.any(Object),
                    updatedAt: expect.any(Object),
                    places: expect.any(Array),
                })
            );
        });

        it("should return a NotFound error if user id doesn't exist", async () => {
            await expect(GuideService.getGuideByAuthorId(999)).rejects.toThrow(NotFoundError);
        });

        it("should rethrow whatever error came from model method", async () => {
            jest.spyOn(Guide, "getByAuthorId").mockRejectedValue(
                new BadRequestError("A bad request")
            );

            await expect(GuideService.getGuideByAuthorId(1)).rejects.toThrow(BadRequestError);
        });

        it("should throw an App Error if an unspecified issue occurred", async () => {
            jest.spyOn(Guide, "getByAuthorId").mockRejectedValue(new Error("A random error"));

            await expect(GuideService.getGuideByAuthorId(1)).rejects.toThrow(AppError);
        });
    });

    describe("getGuidesByLatLong", () => {
        it("should return guide ids near a given lat long", async () => {
            const result = await GuideService.getGuidesByLatLong(LAT, LONG);

            expect(result.length).toEqual(3);
            expect(result[0]).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                })
            );
        });

        it("should limit nearby guide results", async () => {
            const result = await GuideService.getGuidesByLatLong(LAT, LONG, 1);

            expect(result.length).toEqual(1);
        });

        it("should return empty array if no nearby guides found", async () => {
            const result = await GuideService.getGuidesByLatLong(1.0, -1.0);

            expect(result).toEqual([]);
        });

        it("should rethrow whatever error came from model method", async () => {
            jest.spyOn(Guide, "getNearbyByLatLong").mockRejectedValue(
                new BadRequestError("A bad request")
            );

            await expect(GuideService.getGuidesByLatLong(1)).rejects.toThrow(BadRequestError);
        });

        it("should throw an App Error if an unspecified issue occurred", async () => {
            jest.spyOn(Guide, "getNearbyByLatLong").mockRejectedValue(new Error("A random error"));

            await expect(GuideService.getGuidesByLatLong(1)).rejects.toThrow(AppError);
        });
    });

    describe("getRandomGuide", () => {
        it("should return a guide", async () => {
            const result = await GuideService.getRandomGuide();

            expect(result).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                    authorId: expect.any(Number),
                    googlePlaceId: expect.any(String),
                    title: expect.any(String),
                    isPrivate: false,
                    latitude: expect.any(Number),
                    longitude: expect.any(Number),
                    description: expect.any(String),
                    createdAt: expect.any(Object),
                    updatedAt: expect.any(Object),
                    places: expect.any(Array),
                })
            );
        });

        it("should throw an App Error if an unspecified issue occurred", async () => {
            jest.spyOn(Guide, "getRandom").mockRejectedValue(new Error("A random error"));

            await expect(GuideService.getRandomGuide()).rejects.toThrow(AppError);
        });
    });

    describe("addGuide", () => {
        const NEW_GUIDE = {
            googlePlaceId: GOOGLE_PLACE_ID,
            title: "New Guide",
            isPrivate: false,
            latitude: LAT,
            longitude: LONG,
        };

        it("should create a guide", async () => {
            const users = await User.getAll();
            NEW_GUIDE.authorId = users[0].id;

            const result = await GuideService.addGuide(NEW_GUIDE);

            expect(result).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                    authorId: NEW_GUIDE.authorId,
                    googlePlaceId: GOOGLE_PLACE_ID,
                    title: NEW_GUIDE.title,
                    isPrivate: NEW_GUIDE.isPrivate,
                    latitude: LAT,
                    longitude: LONG,
                    description: null,
                    createdAt: expect.any(Object),
                    updatedAt: expect.any(Object),
                })
            );
        });

        it("should return a NotFound error if user doesn't exist", async () => {
            NEW_GUIDE.authorId = 999;

            await expect(GuideService.addGuide(NEW_GUIDE)).rejects.toThrow(NotFoundError);
        });

        it("should rethrow whatever error came from model method", async () => {
            jest.spyOn(Guide, "create").mockRejectedValue(new BadRequestError("A bad request"));

            await expect(GuideService.addGuide(NEW_GUIDE)).rejects.toThrow(BadRequestError);
        });

        it("should throw an App Error if an unspecified issue occurred", async () => {
            jest.spyOn(Guide, "create").mockRejectedValue(new Error("A random error"));

            await expect(GuideService.addGuide(NEW_GUIDE)).rejects.toThrow(AppError);
        });
    });

    describe("updateGuide", () => {
        const GUIDE_DATA = {
            title: "New Title",
            description: "New description.",
            isPrivate: false,
        };

        it("should update a guide", async () => {
            const guides = await Guide.getAll();
            const result = await GuideService.updateGuide(guides[0].id, GUIDE_DATA);

            expect(result).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                    authorId: guides[0].authorId,
                    googlePlaceId: GOOGLE_PLACE_ID,
                    title: GUIDE_DATA.title,
                    isPrivate: GUIDE_DATA.isPrivate,
                    latitude: LAT,
                    longitude: LONG,
                    description: GUIDE_DATA.description,
                    createdAt: expect.any(Object),
                    updatedAt: expect.any(Object),
                })
            );
        });

        it("should throw an NotFoundError if guide doesn't exist", async () => {
            await expect(GuideService.updateGuide(999, GUIDE_DATA)).rejects.toThrow(NotFoundError);
        });

        it("should rethrow whatever error came from model method", async () => {
            jest.spyOn(Guide, "update").mockRejectedValue(new BadRequestError("A bad request"));

            await expect(GuideService.updateGuide(1, GUIDE_DATA)).rejects.toThrow(BadRequestError);
        });

        it("should throw an App Error if an unspecified issue occurred", async () => {
            jest.spyOn(Guide, "update").mockRejectedValue(new Error("A random error"));

            await expect(GuideService.updateGuide(1, GUIDE_DATA)).rejects.toThrow(AppError);
        });
    });

    describe("deleteGuide", () => {
        it("should delete a guide", async () => {
            const guides = await Guide.getAll();
            const result = await GuideService.deleteGuide(guides[0].id);

            expect(result).toEqual(
                expect.objectContaining({
                    id: guides[0].id,
                })
            );
        });

        it("should throw an NotFoundError if guide doesn't exist", async () => {
            await expect(GuideService.deleteGuide(999)).rejects.toThrow(NotFoundError);
        });

        it("should rethrow whatever error came from model method", async () => {
            jest.spyOn(Guide, "delete").mockRejectedValue(new BadRequestError("A bad request"));

            await expect(GuideService.deleteGuide(1)).rejects.toThrow(BadRequestError);
        });

        it("should throw an App Error if an unspecified issue occurred", async () => {
            jest.spyOn(Guide, "delete").mockRejectedValue(new Error("A random error"));

            await expect(GuideService.deleteGuide(1)).rejects.toThrow(AppError);
        });
    });
});
