/**
 * @jest-environment node
 */

const db = require("@/lib/db");
const PlaceTag = require("@/models/PlaceTag");
const User = require("@/models/User");
const Guide = require("@/models/Guide");
const Tag = require("@/models/Tag");
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

describe("PlaceTag Model", () => {
    beforeEach(() => {
        jest.restoreAllMocks();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("getAll", () => {
        it("should return all place tags", async () => {
            const result = await PlaceTag.getAll();

            expect(result.length).toEqual(2);
            expect(result[0]).toEqual(
                expect.objectContaining({
                    placeId: expect.any(Number),
                    tagId: expect.any(Number),
                    createdAt: expect.any(Object),
                })
            );
        });

        it("should limit guide share results", async () => {
            const result = await PlaceTag.getAll(1, 0);

            expect(result.length).toEqual(1);
        });
    });

    describe("getTagsByPlaceId", () => {
        it("should get place tags by a place id", async () => {
            const placeTags = await PlaceTag.getAll();
            const result = await PlaceTag.getTagsByPlaceId(placeTags[0].placeId);

            expect(result.length).toEqual(2);
            expect(result[0]).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                    name: expect.any(String),
                })
            );
        });

        it("should return a NotFound error if place doesn't exist", async () => {
            jest.spyOn(PlaceTag, "checkIfPlaceExists").mockImplementation(() => {
                throw new NotFoundError("Place not found");
            });

            await expect(PlaceTag.getTagsByPlaceId(0)).rejects.toThrow(NotFoundError);
        });
    });

    describe("getTagsByGuideId", () => {
        it("should get tags assigned to places on a guide", async () => {
            const guides = await Guide.getAll();
            const result = await PlaceTag.getTagsByGuideId(guides[0].id);

            expect(result.length).toEqual(2);
            expect(result[0]).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                    name: expect.any(String),
                    count: expect.any(Number),
                })
            );
        });

        it("should return a NotFound error if guide doesn't exist", async () => {
            jest.spyOn(PlaceTag, "checkIfGuideExists").mockImplementation(() => {
                throw new NotFoundError("Guide not found");
            });

            await expect(PlaceTag.getTagsByGuideId(0)).rejects.toThrow(NotFoundError);
        });
    });

    describe("getPlacesByTagId", () => {
        it("should get places that have a certain tag", async () => {
            const placeTags = await PlaceTag.getAll();
            const result = await PlaceTag.getPlacesByTagId(placeTags[0].placeId);

            expect(result.length).toEqual(1);
            expect(result[0]).toEqual(
                expect.objectContaining({
                    placeId: expect.any(Number),
                })
            );
        });

        it("should return a NotFound error if the tag doesn't exist", async () => {
            jest.spyOn(PlaceTag, "checkIfTagExists").mockImplementation(() => {
                throw new NotFoundError("Tag not found");
            });

            await expect(PlaceTag.getPlacesByTagId(0)).rejects.toThrow(NotFoundError);
        });
    });

    describe("create", () => {
        it("should create a place tag", async () => {
            const placeTags = await PlaceTag.getAll();
            const tag = await Tag.getByName("Breakfast");

            const result = await PlaceTag.create(placeTags[0].placeId, tag.id);

            expect(result).toEqual(
                expect.objectContaining({
                    placeId: expect.any(Number),
                    tagId: expect.any(Number),
                    createdAt: expect.any(Object),
                    name: expect.any(String),
                })
            );
        });

        it("should return a BadRequest error if tag already assigned to that place", async () => {
            jest.spyOn(PlaceTag, "checkIfDuplicatePlaceTag").mockImplementation(() => {
                throw new BadRequestError("Duplicate place tag");
            });

            await expect(PlaceTag.create(1, 1)).rejects.toThrow(BadRequestError);
        });

        it("should return a NotFound error if place doesn't exist", async () => {
            jest.spyOn(PlaceTag, "checkIfPlaceExists").mockImplementation(() => {
                throw new NotFoundError("Place doesn't exist.");
            });

            await expect(PlaceTag.create(0, 3)).rejects.toThrow(NotFoundError);
        });

        it("should return a BadRequest error if tag doesn't exist", async () => {
            jest.spyOn(PlaceTag, "checkIfTagExists").mockImplementation(() => {
                throw new BadRequestError("Tag doesn't exist.");
            });

            await expect(PlaceTag.create(1, 999)).rejects.toThrow(BadRequestError);
        });
    });

    describe("delete", () => {
        it("should delete a a place tag", async () => {
            const placeTags = await PlaceTag.getAll();
            const result = await PlaceTag.delete(placeTags[0].placeId, placeTags[0].tagId);

            expect(result).toEqual(
                expect.objectContaining({
                    placeId: expect.any(Number),
                    tagId: expect.any(Number),
                })
            );
        });

        it("should return a NotFound error if the place tag doesn't exist", async () => {
            jest.spyOn(PlaceTag, "checkIfPlaceTagExists").mockImplementation(() => {
                throw new NotFoundError("Place tag not found");
            });

            await expect(PlaceTag.delete(0, 0)).rejects.toThrow(NotFoundError);
        });
    });

    describe("deleteAll", () => {
        it("should delete all place tags for a place", async () => {
            const placeTags = await PlaceTag.getAll();
            const result = await PlaceTag.deleteAll(placeTags[0].placeId);
            expect(result.length).toEqual(2);

            const checkPlaceTags = await PlaceTag.getTagsByPlaceId(placeTags[0].placeId);
            expect(checkPlaceTags.length).toEqual(0);
        });

        it("should return a NotFound error if the place doesn't exist", async () => {
            jest.spyOn(PlaceTag, "checkIfPlaceExists").mockImplementation(() => {
                throw new NotFoundError("Place not found");
            });

            await expect(PlaceTag.deleteAll(0)).rejects.toThrow(NotFoundError);
        });
    });

    describe("checkIfPlaceExists", () => {
        it("should return undefined if place exists", async () => {
            const placeTags = await PlaceTag.getAll();
            const result = await PlaceTag.checkIfPlaceExists(placeTags[0].placeId);

            expect(result).toEqual(undefined);
        });

        it("should return a NotFound error if place doesn't exist", async () => {
            await expect(PlaceTag.checkIfPlaceExists(0)).rejects.toThrow(NotFoundError);
        });
    });

    describe("checkIfPlaceTagExists", () => {
        it("should return undefined if place tag exists", async () => {
            const placeTags = await PlaceTag.getAll();
            const result = await PlaceTag.checkIfPlaceTagExists(
                placeTags[0].placeId,
                placeTags[0].tagId
            );

            expect(result).toEqual(undefined);
        });

        it("should return a NotFound error if place tag doesn't exist", async () => {
            await expect(PlaceTag.checkIfPlaceTagExists(0, 0)).rejects.toThrow(NotFoundError);
        });
    });

    describe("checkIfGuideExists", () => {
        it("should return undefined if guide exists", async () => {
            const guides = await Guide.getAll();
            const result = await PlaceTag.checkIfGuideExists(guides[0].id);

            expect(result).toEqual(undefined);
        });

        it("should return a NotFound error if guide doesn't exist", async () => {
            await expect(PlaceTag.checkIfGuideExists(0)).rejects.toThrow(NotFoundError);
        });
    });

    describe("checkIfTagExists", () => {
        it("should return undefined if tag exists", async () => {
            const tags = await Tag.getAll();
            const result = await PlaceTag.checkIfTagExists(tags[0].id);

            expect(result).toEqual(undefined);
        });

        it("should return a NotFound error if tag doesn't exist", async () => {
            await expect(PlaceTag.checkIfTagExists(0)).rejects.toThrow(NotFoundError);
        });
    });

    describe("checkIfDuplicatePlaceTag", () => {
        it("should return undefined if not a duplicate place tag", async () => {
            const result = await PlaceTag.checkIfDuplicatePlaceTag(1, 999);

            expect(result).toEqual(undefined);
        });

        it("should return a BadRequestError error if duplicate guide share", async () => {
            const placeTags = await PlaceTag.getAll();

            await expect(
                PlaceTag.checkIfDuplicatePlaceTag(placeTags[0].placeId, placeTags[0].tagId)
            ).rejects.toThrow(BadRequestError);
        });
    });
});
