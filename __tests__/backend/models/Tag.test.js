/**
 * @jest-environment node
 */

const db = require("../../../src/lib/db");
const Tag = require("../../../src/models/Tag");
const { NotFoundError, BadRequestError, DatabaseError } = require("../../../src/utils/errors");
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

describe("Tag model", () => {
    beforeEach(() => {
        jest.restoreAllMocks();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("getAll", () => {
        it("should return all tags", async () => {
            // Call the actual method that retrieves data from the database
            const result = await Tag.getAll();

            expect(result.length).toBeGreaterThan(1);
            expect(result[0]).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                    name: expect.any(String),
                    createdAt: expect.any(Object),
                })
            );
        });
    });

    describe("getById", () => {
        it("should return a tag", async () => {
            const tags = await Tag.getAll();

            const result = await Tag.getById(tags[0].id);

            expect(result).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                    name: expect.any(String),
                    createdAt: expect.any(Object),
                    updatedAt: expect.any(Object),
                })
            );
        });

        it("should return a NotFound error if tag doesn't exist", async () => {
            jest.spyOn(Tag, "checkIfTagExists").mockImplementation(() => {
                throw new NotFoundError("Tag not found");
            });

            await expect(Tag.getById(0)).rejects.toThrow(NotFoundError);
        });
    });

    describe("getByName", () => {
        it("should return a tag", async () => {
            const result = await Tag.getByName("Nature");

            expect(result).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                    name: "Nature",
                    createdAt: expect.any(Object),
                    updatedAt: expect.any(Object),
                })
            );
        });

        it("should return undefined if tag name doesn't exist", async () => {
            const result = await Tag.getByName("notreal");

            await expect(result).toBe(undefined);
        });
    });

    describe("create", () => {
        it("should create a user", async () => {
            const result = await Tag.create("Foo");

            expect(result).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                    name: "Foo",
                    createdAt: expect.any(Object),
                    updatedAt: expect.any(Object),
                })
            );
        });

        it("should return a BadRequest error if dupe tag name provided", async () => {
            // Mock `checkIfDuplicateTagName` to throw a `BadRequestError`
            jest.spyOn(Tag, "checkIfDuplicateTagName").mockImplementation(() => {
                throw new BadRequestError("Duplicate tag");
            });

            // Assert that `User.getById` throws the `NotFoundError`
            await expect(Tag.create("Nature")).rejects.toThrow(BadRequestError);
        });
    });

    describe("update", () => {
        it("should update a tag", async () => {
            const tag = await Tag.getByName("Nature");

            const result = await Tag.update(tag.id, { name: "NewnNature" });

            expect(result).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                    name: "NewnNature",
                    createdAt: expect.any(Object),
                    updatedAt: expect.any(Object),
                })
            );
        });

        it("should return a NotFound error if tag id doesn't exist", async () => {
            jest.spyOn(Tag, "checkIfTagExists").mockImplementation(() => {
                throw new NotFoundError("Tag not found");
            });

            await expect(Tag.update(0, "Foo")).rejects.toThrow(NotFoundError);
        });

        it("should return a BadRequest error if dupe tag name", async () => {
            const tag = await Tag.getByName("Nature");

            jest.spyOn(Tag, "checkIfDuplicateTagName").mockImplementation(() => {
                throw new BadRequestError("Duplicate tag");
            });

            await expect(Tag.update(tag.id, "Breakfast")).rejects.toThrow(BadRequestError);
        });
    });

    describe("delete", () => {
        it("should delete a tag", async () => {
            const tags = await Tag.getAll();
            const result = await Tag.delete(tags[0].id);

            expect(result).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                })
            );
        });

        it("should return a NotFound error if tag doesn't exist", async () => {
            jest.spyOn(Tag, "checkIfTagExists").mockImplementation(() => {
                throw new NotFoundError("Tag not found");
            });

            await expect(Tag.delete(0)).rejects.toThrow(NotFoundError);
        });
    });

    describe("checkIfTagExists", () => {
        it("should return undefined if tag exists", async () => {
            const tags = await Tag.getAll();
            const result = await Tag.checkIfTagExists(tags[0].id);

            expect(result).toEqual(undefined);
        });

        it("should return a NotFound error if tag doesn't exist", async () => {
            await expect(Tag.checkIfTagExists(0)).rejects.toThrow(NotFoundError);
        });
    });

    describe("checkIfTagNameExists", () => {
        it("should return undefined if tag name exists", async () => {
            const tags = await Tag.getAll();
            const result = await Tag.checkIfTagNameExists(tags[0].name);

            expect(result).toEqual(undefined);
        });

        it("should return a NotFound error if tag name doesn't exist", async () => {
            await expect(Tag.checkIfTagNameExists("Foobar")).rejects.toThrow(NotFoundError);
        });
    });

    describe("checkIfDuplicateTagName", () => {
        it("should return undefined if not a duplicate tag", async () => {
            const result = await Tag.checkIfDuplicateTagName("Foobar");

            expect(result).toEqual(undefined);
        });

        it("should return a BadRequestError error if duplicate tag", async () => {
            const tags = await Tag.getAll();
            await expect(Tag.checkIfDuplicateTagName(tags[0].name)).rejects.toThrow(
                BadRequestError
            );
        });
    });
});
