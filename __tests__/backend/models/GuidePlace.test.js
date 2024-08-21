/**
 * @jest-environment node
 */

const db = require("@/lib/db");
const GuidePlace = require("@/models/GuidePlace");
const Guide = require("@/models/Guide");
const { NotFoundError, BadRequestError, DatabaseError } = require("@/utils/errors");
const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
} = require("../testCommon");
const { experimental_jwksCache } = require("jose");

const GOOGLE_PLACE_ID = "ChIJxeyK9Z3wloAR_gOA7SycJC0";

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("GuidePlace Model", () => {
    beforeEach(() => {
        jest.restoreAllMocks();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("getAll", () => {
        it("should return all guide places", async () => {
            const result = await GuidePlace.getAll();

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
            const result = await GuidePlace.getAll(1, 0);

            expect(result.length).toEqual(1);
        });
    });

    describe("getById", () => {
        it("should return a guide place", async () => {
            const guidePlaces = await GuidePlace.getAll();

            const result = await GuidePlace.getById(guidePlaces[0].id);

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
            jest.spyOn(GuidePlace, "checkIfGuidePlaceExists").mockImplementation(() => {
                throw new NotFoundError("Guide place not found");
            });

            await expect(GuidePlace.getById(0)).rejects.toThrow(NotFoundError);
        });
    });

    describe("getByGuideId", () => {
        it("should return guide places associated with a guide", async () => {
            const guides = await Guide.getAll();
            const result = await GuidePlace.getByGuideId(guides[0].id);

            expect(result.length).toEqual(2);
            expect(result[0]).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                })
            );
        });

        it("should return a NotFound error if guide doesn't exist", async () => {
            jest.spyOn(GuidePlace, "checkIfGuideExists").mockImplementation(() => {
                throw new NotFoundError("Guide not found");
            });

            await expect(GuidePlace.getByGuideId(0)).rejects.toThrow(NotFoundError);
        });
    });

    describe("getByGooglePlaceId", () => {
        it("should return guide place associated with a google place", async () => {
            const guides = await Guide.getAll();
            const result = await GuidePlace.getByGooglePlaceId(guides[0].id, GOOGLE_PLACE_ID);

            expect(result).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                })
            );
        });

        it("should return an empty list if google place not on guide", async () => {
            const guides = await Guide.getAll();
            const result = await GuidePlace.getByGooglePlaceId(guides[0].id, "FOOBAR");

            expect(result).toEqual(undefined);
        });

        it("should return a NotFound error if guide doesn't exist", async () => {
            jest.spyOn(GuidePlace, "checkIfGuideExists").mockImplementation(() => {
                throw new NotFoundError("Guide not found");
            });

            await expect(GuidePlace.getByGooglePlaceId(0, GOOGLE_PLACE_ID)).rejects.toThrow(
                NotFoundError
            );
        });
    });

    describe("create", () => {
        it("should create a guide place", async () => {
            const guides = await Guide.getAll();
            const newPlace = {
                googlePlaceId: "NEWGPLACEID",
                description: "Check out this place.",
                recType: "dontmiss",
            };
            const result = await GuidePlace.create(guides[0].id, newPlace);

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

        it("should return a DatbaseError if non-enum recType provided", async () => {
            const guides = await Guide.getAll();
            const newPlace = {
                googlePlaceId: "NEWGPLACEID",
                description: "Check out this place.",
                recType: "foobar",
            };

            await expect(GuidePlace.create(guides[0].id, newPlace)).rejects.toThrow(DatabaseError);
        });

        it("should return a BadRequest error if dupe place provided", async () => {
            const guides = await Guide.getAll();
            const newPlace = {
                googlePlaceId: GOOGLE_PLACE_ID,
                description: "Check out this place.",
                recType: "dontmiss",
            };

            jest.spyOn(GuidePlace, "checkIfDuplicateGooglePlace").mockImplementation(() => {
                throw new BadRequestError("Duplicate place");
            });

            await expect(GuidePlace.create(guides[0].id, newPlace)).rejects.toThrow(
                BadRequestError
            );
        });

        it("should return a NotFound error if guide doesn't exist", async () => {
            const newPlace = {
                googlePlaceId: GOOGLE_PLACE_ID,
                description: "Check out this place.",
                recType: "dontmiss",
            };

            jest.spyOn(GuidePlace, "checkIfGuideExists").mockImplementation(() => {
                throw new NotFoundError("Guide not found");
            });

            await expect(GuidePlace.create(0, newPlace)).rejects.toThrow(NotFoundError);
        });
    });

    describe("update", () => {
        it("should update a guide place", async () => {
            const places = await GuidePlace.getAll();

            const data = {
                description: "New description.",
            };

            const result = await GuidePlace.update(places[0].id, data);

            expect(result).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                    guideId: expect.any(Number),
                    googlePlaceId: expect.any(String),
                    description: "New description.",
                    recType: expect.any(String),
                    createdAt: expect.any(Object),
                    updatedAt: expect.any(Object),
                })
            );
        });

        it("should return a NotFound error if guide place doesn't exist", async () => {
            const data = {
                description: "New description.",
            };

            jest.spyOn(GuidePlace, "checkIfGuidePlaceExists").mockImplementation(() => {
                throw new NotFoundError("Guide place not found");
            });

            await expect(GuidePlace.update(0, data)).rejects.toThrow(NotFoundError);
        });

        it("should throw a DatabaseError if id is attempted to be modified", async () => {
            const places = await GuidePlace.getAll();

            const data = {
                id: 999,
            };

            await expect(GuidePlace.update(places[0].id, data)).rejects.toThrow(DatabaseError);
        });
    });

    describe("delete", () => {
        it("should delete a guide place", async () => {
            const places = await GuidePlace.getAll();
            const result = await GuidePlace.delete(places[0].id);

            expect(result).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                })
            );
        });

        it("should return a NotFound error if guide place doesn't exist", async () => {
            jest.spyOn(GuidePlace, "checkIfGuidePlaceExists").mockImplementation(() => {
                throw new NotFoundError("Guide place not found");
            });

            await expect(GuidePlace.delete(0)).rejects.toThrow(NotFoundError);
        });
    });

    describe("checkIfGuideExists", () => {
        it("should return undefined if guide exists", async () => {
            const guides = await Guide.getAll();
            const result = await GuidePlace.checkIfGuideExists(guides[0].id);

            expect(result).toEqual(undefined);
        });

        it("should return a NotFound error if guide doesn't exist", async () => {
            await expect(GuidePlace.checkIfGuideExists(0)).rejects.toThrow(NotFoundError);
        });
    });

    describe("checkIfGuidePlaceExists", () => {
        it("should return undefined if guide place exists", async () => {
            const places = await GuidePlace.getAll();
            const result = await GuidePlace.checkIfGuidePlaceExists(places[0].id);

            expect(result).toEqual(undefined);
        });

        it("should return a NotFound error if guide place doesn't exist", async () => {
            await expect(GuidePlace.checkIfGuidePlaceExists(9999)).rejects.toThrow(NotFoundError);
        });
    });

    describe("checkIfDuplicateGooglePlace", () => {
        it("should return undefined if not a duplicate guide place", async () => {
            const result = await GuidePlace.checkIfDuplicateGooglePlace(1, "FOOBAR");

            expect(result).toEqual(undefined);
        });

        it("should return a BadRequestError error if duplicate guide place", async () => {
            const guides = await Guide.getAll();

            await expect(
                GuidePlace.checkIfDuplicateGooglePlace(guides[0].id, GOOGLE_PLACE_ID)
            ).rejects.toThrow(BadRequestError);
        });
    });
});
