/**
 * @jest-environment node
 */

const db = require("@/lib/db");
const Guide = require("@/models/Guide");
const User = require("@/models/User");
const { NotFoundError, BadRequestError, DatabaseError } = require("@/utils/errors");
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

describe("Guide Model", () => {
    beforeEach(() => {
        jest.restoreAllMocks();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("getAll", () => {
        it("should return all guides", async () => {
            const result = await Guide.getAll();

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
            const result = await Guide.getAll(1, 0);

            expect(result.length).toEqual(1);
        });
    });

    describe("getById", () => {
        it("should return a guide", async () => {
            const guides = await Guide.getAll();
            const result = await Guide.getById(guides[0].id);

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
                    author: expect.any(Object),
                    placeTags: expect.any(Array),
                })
            );
        });

        it("should return a NotFound error if guide doesn't exist", async () => {
            jest.spyOn(Guide, "checkIfGuideExists").mockImplementation(() => {
                throw new NotFoundError("Guide not found");
            });

            await expect(Guide.getById(0)).rejects.toThrow(NotFoundError);
        });
    });

    describe("getByAuthorId", () => {
        it("should return a guide", async () => {
            const guides = await Guide.getAll();
            const result = await Guide.getByAuthorId(guides[0].authorId);

            expect(result).toEqual(expect.any(Array));
            expect(result.length).toEqual(4);
        });

        it("should return empty array if the user didn't author any guides", async () => {
            const users = await User.getAll();
            const result = await Guide.getByAuthorId(users[2].id);

            expect(result).toEqual([]);
        });

        it("should return a NotFound error if user doesn't exist", async () => {
            jest.spyOn(Guide, "checkIfUserExists").mockImplementation(() => {
                throw new NotFoundError("User not found");
            });

            await expect(Guide.getByAuthorId(0)).rejects.toThrow(NotFoundError);
        });
    });

    describe("getNearbyByLatLong", () => {
        it("should return nearby guides", async () => {
            const result = await Guide.getNearbyByLatLong(LAT, LONG);

            expect(result.length).toEqual(3);
            expect(result[0]).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                })
            );
        });

        it("should limit nearby guide results", async () => {
            const result = await Guide.getNearbyByLatLong(LAT, LONG, 1);

            expect(result.length).toEqual(1);
        });

        it("should return empty array if no nearby guides found", async () => {
            const result = await Guide.getNearbyByLatLong(1.0, -1.0);

            expect(result).toEqual([]);
        });

        it("should return a DatabaseError if incorrect parameter provided", async () => {
            await expect(Guide.getNearbyByLatLong(LAT, LONG, 1, "foobar")).rejects.toThrow(
                DatabaseError
            );
        });
    });

    describe("getRandom", () => {
        it("should return a guide", async () => {
            const result = await Guide.getRandom();

            expect(result).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                })
            );
        });
    });

    describe("create", () => {
        it("should create a guide", async () => {
            const users = await User.getAll();

            const newGuide = {
                authorId: users[0].id,
                googlePlaceId: GOOGLE_PLACE_ID,
                title: "New Guide",
                isPrivate: false,
                latitude: LAT,
                longitude: LONG,
            };

            const result = await Guide.create(newGuide);

            expect(result).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                    authorId: users[0].id,
                    googlePlaceId: GOOGLE_PLACE_ID,
                    title: "New Guide",
                    isPrivate: false,
                    latitude: LAT,
                    longitude: LONG,
                    description: null,
                    createdAt: expect.any(Object),
                    updatedAt: expect.any(Object),
                })
            );
        });

        it("should return a NotFound error if user doesn't exist", async () => {
            const newGuide = {
                authorId: 9999,
                googlePlaceId: GOOGLE_PLACE_ID,
                title: "New Guide",
                isPrivate: false,
                latitude: LAT,
                longitude: LONG,
            };

            jest.spyOn(Guide, "checkIfUserExists").mockImplementation(() => {
                throw new NotFoundError("User not found");
            });

            await expect(Guide.create(newGuide)).rejects.toThrow(NotFoundError);
        });

        it("should return a DatabaseError if bad data provided", async () => {
            const users = await User.getAll();

            const newGuide = {
                authorId: users[0].id,
                googlePlaceId: null,
                title: null,
                isPrivate: false,
                latitude: LAT,
                longitude: LONG,
            };

            await expect(Guide.create(newGuide)).rejects.toThrow(DatabaseError);
        });
    });

    describe("update", () => {
        it("should update a guide", async () => {
            const guides = await Guide.getAll();

            const data = {
                title: "New Title",
                description: "My description",
            };

            const result = await Guide.update(guides[0].id, data);

            expect(result).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                    authorId: expect.any(Number),
                    googlePlaceId: GOOGLE_PLACE_ID,
                    title: "New Title",
                    isPrivate: false,
                    latitude: LAT,
                    longitude: LONG,
                    description: "My description",
                    createdAt: expect.any(Object),
                    updatedAt: expect.any(Object),
                })
            );
        });

        it("should return a NotFound error if guide id doesn't exist", async () => {
            const data = {
                title: "New Title",
                description: "My description",
            };

            jest.spyOn(Guide, "checkIfGuideExists").mockImplementation(() => {
                throw new NotFoundError("Guide not found");
            });

            await expect(Guide.update(0, data)).rejects.toThrow(NotFoundError);
        });

        it("should throw an error if Google Place ID is attempted to be modified", async () => {
            const guides = await Guide.getAll();

            const data = {
                googlePlaceId: "foobar",
            };

            await expect(Guide.update(guides[0].id, data)).rejects.toThrow(DatabaseError);
        });
    });

    describe("delete", () => {
        it("should delete a guide", async () => {
            const guides = await Guide.getAll();
            const result = await Guide.delete(guides[0].id);

            expect(result).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                })
            );
        });

        it("should return a NotFound error if guide doesn't exist", async () => {
            jest.spyOn(Guide, "checkIfGuideExists").mockImplementation(() => {
                throw new NotFoundError("Guide not found");
            });

            await expect(Guide.delete(0)).rejects.toThrow(NotFoundError);
        });
    });

    describe("checkIfGuideExists", () => {
        it("should return undefined if guide exists", async () => {
            const guides = await Guide.getAll();
            const result = await Guide.checkIfGuideExists(guides[0].id);

            expect(result).toEqual(undefined);
        });

        it("should return a NotFound error if guide doesn't exist", async () => {
            await expect(Guide.checkIfGuideExists(0)).rejects.toThrow(NotFoundError);
        });
    });

    describe("checkIfUserExists", () => {
        it("should return undefined if user exists", async () => {
            const users = await User.getAll();
            const result = await Guide.checkIfUserExists(users[0].id);

            expect(result).toEqual(undefined);
        });

        it("should return a NotFound error if user doesn't exist", async () => {
            await expect(Guide.checkIfUserExists(0)).rejects.toThrow(NotFoundError);
        });
    });
});
