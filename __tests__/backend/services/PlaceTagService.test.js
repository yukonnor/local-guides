/**
 * @jest-environment node
 */

const PlaceTagService = require("@/services/PlaceTagService");
const Tag = require("@/models/Tag");
const Guide = require("@/models/Guide");
const GuidePlace = require("@/models/GuidePlace");
const PlaceTag = require("@/models/PlaceTag");
const { AppError, NotFoundError, BadRequestError } = require("@/utils/errors");
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

describe("PlaceTag Service", () => {
    beforeEach(() => {
        jest.restoreAllMocks();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("getTags", () => {
        it("should return all tags", async () => {
            const result = await PlaceTagService.getTags();

            expect(result.length).toBeGreaterThan(1);
            expect(result[0]).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                    name: expect.any(String),
                    createdAt: expect.any(Object),
                })
            );
        });

        it("should throw AppError if no place tags found", async () => {
            jest.spyOn(Tag, "getAll").mockResolvedValue([]);

            await expect(PlaceTagService.getTags()).rejects.toThrow(AppError);
        });

        it("should rethrow whatever error came from model method", async () => {
            jest.spyOn(Tag, "getAll").mockRejectedValue(new BadRequestError("A bad request"));

            await expect(PlaceTagService.getTags()).rejects.toThrow(BadRequestError);
        });
    });

    describe("getTagById", () => {
        it("should return a tag based on id", async () => {
            const tags = await Tag.getAll();
            const result = await PlaceTagService.getTagById(tags[0].id);

            expect(result).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                    name: expect.any(String),
                    createdAt: expect.any(Object),
                    updatedAt: expect.any(Object),
                })
            );
        });

        it("should rethrow whatever error came from model method", async () => {
            jest.spyOn(Tag, "getById").mockRejectedValue(new BadRequestError("A bad request"));

            await expect(PlaceTagService.getTagById()).rejects.toThrow(BadRequestError);
        });

        it("should throw an App Error if an unspecified issue occurred", async () => {
            jest.spyOn(Tag, "getById").mockRejectedValue(new Error("A random error"));

            await expect(PlaceTagService.getTagById()).rejects.toThrow(AppError);
        });
    });

    describe("getTagByName", () => {
        it("should return a tags based on tag name", async () => {
            const result = await PlaceTagService.getTagByName("Breakfast");

            expect(result).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                    name: "Breakfast",
                    createdAt: expect.any(Object),
                    updatedAt: expect.any(Object),
                })
            );
        });

        it("should rethrow whatever error came from model method", async () => {
            jest.spyOn(Tag, "getByName").mockRejectedValue(new BadRequestError("A bad request"));

            await expect(PlaceTagService.getTagByName(1)).rejects.toThrow(BadRequestError);
        });

        it("should throw an App Error if an unspecified issue occurred", async () => {
            jest.spyOn(Tag, "getByName").mockRejectedValue(new Error("A random error"));

            await expect(PlaceTagService.getTagByName(1)).rejects.toThrow(AppError);
        });
    });

    describe("addTag", () => {
        it("should create a tag", async () => {
            const result = await PlaceTagService.addTag({ name: "Newtag" });

            expect(result).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                    name: "Newtag",
                    createdAt: expect.any(Object),
                    updatedAt: expect.any(Object),
                })
            );
        });

        it("should update tag to title case", async () => {
            const result = await PlaceTagService.addTag({ name: "foo" });

            expect(result).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                    name: "Foo",
                    createdAt: expect.any(Object),
                    updatedAt: expect.any(Object),
                })
            );
        });

        it("should rethrow whatever error came from model method", async () => {
            jest.spyOn(Tag, "create").mockRejectedValue(new BadRequestError("A bad request"));

            await expect(PlaceTagService.addTag({ name: "Newtag" })).rejects.toThrow(
                BadRequestError
            );
        });

        it("should throw an App Error if an unspecified issue occurred", async () => {
            jest.spyOn(Tag, "create").mockRejectedValue(new Error("A random error"));

            await expect(PlaceTagService.addTag({ name: "Newtag" })).rejects.toThrow(AppError);
        });
    });

    describe("updateTag", () => {
        it("should update a tag", async () => {
            const tags = await Tag.getAll();
            const result = await PlaceTagService.updateTag(tags[0].id, { name: "Updated" });

            expect(result).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                    name: "Updated",
                    createdAt: expect.any(Object),
                    updatedAt: expect.any(Object),
                })
            );
        });

        it("should update tag to title case", async () => {
            const tags = await Tag.getAll();
            const result = await PlaceTagService.updateTag(tags[0].id, { name: "foo" });

            expect(result).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                    name: "Foo",
                    createdAt: expect.any(Object),
                    updatedAt: expect.any(Object),
                })
            );
        });

        it("should rethrow whatever error came from model method", async () => {
            jest.spyOn(Tag, "update").mockRejectedValue(new BadRequestError("A bad request"));

            await expect(PlaceTagService.updateTag(1, { name: "Hello" })).rejects.toThrow(
                BadRequestError
            );
        });

        it("should throw an App Error if an unspecified issue occurred", async () => {
            jest.spyOn(Tag, "update").mockRejectedValue(new Error("A random error"));

            await expect(PlaceTagService.updateTag(1, { name: "Hello" })).rejects.toThrow(AppError);
        });
    });

    describe("deleteTag", () => {
        it("should delete a tag", async () => {
            const tags = await Tag.getAll();
            const result = await PlaceTagService.deleteTag(tags[0].id);

            expect(result).toEqual(
                expect.objectContaining({
                    id: tags[0].id,
                })
            );
        });

        it("should rethrow whatever error came from model method", async () => {
            jest.spyOn(Tag, "delete").mockRejectedValue(new BadRequestError("A bad request"));

            await expect(PlaceTagService.deleteTag(1)).rejects.toThrow(BadRequestError);
        });

        it("should throw an App Error if an unspecified issue occurred", async () => {
            jest.spyOn(Tag, "delete").mockRejectedValue(new Error("A random error"));

            await expect(PlaceTagService.deleteTag(1)).rejects.toThrow(AppError);
        });
    });

    describe("getPlaceTags", () => {
        it("should return all place tags", async () => {
            const result = await PlaceTagService.getPlaceTags();

            expect(result.length).toEqual(2);
            expect(result[0]).toEqual(
                expect.objectContaining({
                    placeId: expect.any(Number),
                    tagId: expect.any(Number),
                    createdAt: expect.any(Object),
                })
            );
        });

        it("should throw AppError if no place tags found", async () => {
            jest.spyOn(PlaceTag, "getAll").mockResolvedValue([]);

            await expect(PlaceTagService.getPlaceTags()).rejects.toThrow(AppError);
        });

        it("should rethrow whatever error came from model method", async () => {
            jest.spyOn(PlaceTag, "getAll").mockRejectedValue(new BadRequestError("A bad request"));

            await expect(PlaceTagService.getPlaceTags()).rejects.toThrow(BadRequestError);
        });
    });

    describe("getTagsByPlaceId", () => {
        it("should return tags associated with a place id", async () => {
            const placeTags = await PlaceTag.getAll();
            const result = await PlaceTagService.getTagsByPlaceId(placeTags[0].placeId);

            expect(result.length).toEqual(2);
            expect(result[0]).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                    name: expect.any(String),
                })
            );
        });

        it("should rethrow whatever error came from model method", async () => {
            jest.spyOn(PlaceTag, "getTagsByPlaceId").mockRejectedValue(
                new BadRequestError("A bad request")
            );

            await expect(PlaceTagService.getTagsByPlaceId(1)).rejects.toThrow(BadRequestError);
        });

        it("should throw an App Error if an unspecified issue occurred", async () => {
            jest.spyOn(PlaceTag, "getTagsByPlaceId").mockRejectedValue(new Error("A random error"));

            await expect(PlaceTagService.getTagsByPlaceId(1)).rejects.toThrow(AppError);
        });
    });

    describe("getTagsByGuideId", () => {
        it("should return tags found on places on a specific guide", async () => {
            const guides = await Guide.getAll();
            const result = await PlaceTagService.getTagsByGuideId(guides[0].id);

            expect(result.length).toEqual(2);
            expect(result[0]).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                    name: expect.any(String),
                    count: expect.any(Number),
                })
            );
        });

        it("should return an empty array if guide doesn't have place tags", async () => {
            const guides = await Guide.getAll();
            const result = await PlaceTagService.getTagsByGuideId(guides[1].id);

            expect(result).toEqual([]);
        });

        it("should rethrow whatever error came from model method", async () => {
            jest.spyOn(PlaceTag, "getTagsByGuideId").mockRejectedValue(
                new BadRequestError("A bad request")
            );

            await expect(PlaceTagService.getTagsByGuideId(1)).rejects.toThrow(BadRequestError);
        });

        it("should throw an App Error if an unspecified issue occurred", async () => {
            jest.spyOn(PlaceTag, "getTagsByGuideId").mockRejectedValue(new Error("A random error"));

            await expect(PlaceTagService.getTagsByGuideId(1)).rejects.toThrow(AppError);
        });
    });

    describe("getPlacesByTagId", () => {
        it("should return places that have a specific tag", async () => {
            const tag = await Tag.getByName("Nature");
            const result = await PlaceTagService.getPlacesByTagId(tag.id);

            expect(result.length).toEqual(1);
            expect(result[0]).toEqual(
                expect.objectContaining({
                    placeId: expect.any(Number),
                })
            );
        });

        it("should return an empty array if tag isn't assigned to any places", async () => {
            const tag = await Tag.getByName("Breakfast");
            const result = await PlaceTagService.getPlacesByTagId(tag.id);

            expect(result).toEqual([]);
        });

        it("should rethrow whatever error came from model method", async () => {
            jest.spyOn(PlaceTag, "getPlacesByTagId").mockRejectedValue(
                new BadRequestError("A bad request")
            );

            await expect(PlaceTagService.getPlacesByTagId(1)).rejects.toThrow(BadRequestError);
        });

        it("should throw an App Error if an unspecified issue occurred", async () => {
            jest.spyOn(PlaceTag, "getPlacesByTagId").mockRejectedValue(new Error("A random error"));

            await expect(PlaceTagService.getPlacesByTagId(1)).rejects.toThrow(AppError);
        });
    });

    describe("addTagToPlace", () => {
        it("should add a tag to a place", async () => {
            const placeTags = await PlaceTag.getAll();
            const tag = await Tag.getByName("Breakfast");

            const result = await PlaceTagService.addTagToPlace(placeTags[0].placeId, tag.id);

            expect(result).toEqual(
                expect.objectContaining({
                    placeId: expect.any(Number),
                    tagId: expect.any(Number),
                    createdAt: expect.any(Object),
                    name: expect.any(String),
                })
            );
        });

        it("should rethrow whatever error came from model method", async () => {
            jest.spyOn(PlaceTag, "create").mockRejectedValue(new BadRequestError("A bad request"));

            await expect(PlaceTagService.addTagToPlace(1, 1)).rejects.toThrow(BadRequestError);
        });

        it("should throw an App Error if an unspecified issue occurred", async () => {
            jest.spyOn(PlaceTag, "create").mockRejectedValue(new Error("A random error"));

            await expect(PlaceTagService.addTagToPlace(1, 1)).rejects.toThrow(AppError);
        });
    });

    describe("addTagsToPlace", () => {
        it("should add a multiple tags to a place", async () => {
            const places = await GuidePlace.getAll();
            const tags = await Tag.getAll();

            const result = await PlaceTagService.addTagsToPlace(places[1].id, [
                tags[0].id,
                tags[1].id,
            ]);

            expect(result.length).toEqual(2);
            expect(result[0]).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                    name: expect.any(String),
                })
            );
        });

        it("should rethrow whatever error came from called service method", async () => {
            jest.spyOn(PlaceTagService, "addTagToPlace").mockRejectedValue(
                new BadRequestError("A bad request")
            );

            await expect(PlaceTagService.addTagsToPlace(1, [1, 2])).rejects.toThrow(
                BadRequestError
            );
        });

        it("should throw an App Error if an unspecified issue occurred", async () => {
            jest.spyOn(PlaceTagService, "addTagToPlace").mockRejectedValue(
                new Error("A random error")
            );

            await expect(PlaceTagService.addTagsToPlace(1, [1, 2])).rejects.toThrow(AppError);
        });
    });

    describe("deleteTagFromPlace", () => {
        it("should delete a tag from a place", async () => {
            const placeTags = await PlaceTag.getAll();
            const result = await PlaceTagService.deleteTagFromPlace(
                placeTags[0].placeId,
                placeTags[0].tagId
            );

            expect(result).toEqual(
                expect.objectContaining({
                    placeId: expect.any(Number),
                    tagId: expect.any(Number),
                })
            );
        });

        it("should rethrow whatever error came from model method", async () => {
            jest.spyOn(PlaceTag, "delete").mockRejectedValue(new BadRequestError("A bad request"));

            await expect(PlaceTagService.deleteTagFromPlace(1, 1)).rejects.toThrow(BadRequestError);
        });

        it("should throw an App Error if an unspecified issue occurred", async () => {
            jest.spyOn(PlaceTag, "delete").mockRejectedValue(new Error("A random error"));

            await expect(PlaceTagService.deleteTagFromPlace(1, 1)).rejects.toThrow(AppError);
        });
    });

    describe("deleteTagsFromPlace", () => {
        it("should delete all tags from a place", async () => {
            const placeTags = await PlaceTag.getAll();
            const result = await PlaceTagService.deleteTagsFromPlace(placeTags[0].placeId);

            expect(result.length).toEqual(2);

            const checkPlaceTags = await PlaceTag.getTagsByPlaceId(placeTags[0].placeId);
            expect(checkPlaceTags.length).toEqual(0);
        });

        it("should rethrow whatever error came from model method", async () => {
            jest.spyOn(PlaceTag, "deleteAll").mockRejectedValue(
                new BadRequestError("A bad request")
            );

            await expect(PlaceTagService.deleteTagsFromPlace(1)).rejects.toThrow(BadRequestError);
        });

        it("should throw an App Error if an unspecified issue occurred", async () => {
            jest.spyOn(PlaceTag, "deleteAll").mockRejectedValue(new Error("A random error"));

            await expect(PlaceTagService.deleteTagsFromPlace(1)).rejects.toThrow(AppError);
        });
    });

    describe("processTagsFromForm", () => {
        it("should return tag ids for existing tags", async () => {
            const tagsFromForm = [
                { value: 1, label: "Nature" },
                { value: 3, label: "Breakfast" },
            ];
            const result = await PlaceTagService.processTagsFromForm(tagsFromForm);

            expect(result.length).toEqual(2);
            expect(result).toEqual([1, 3]);
        });

        it("should return new tag ids for new tags", async () => {
            const tagsFromForm = [
                { value: 1, label: "Nature" },
                { value: "Newtag", label: "Newtag" },
            ];
            const result = await PlaceTagService.processTagsFromForm(tagsFromForm);

            expect(result.length).toEqual(2);
            expect(result[1]).toEqual(expect.any(Number));
        });

        it("should update tag to title case", async () => {
            const tagsFromForm = [{ value: "new tag", label: "new tag" }];
            const tagIds = await PlaceTagService.processTagsFromForm(tagsFromForm);
            const result = await Tag.getById(tagIds[0]);

            expect(result.name).toEqual("New Tag");
        });

        it("should rethrow whatever error came from service method it calls", async () => {
            jest.spyOn(PlaceTagService, "getTagByName").mockRejectedValue(
                new BadRequestError("A bad request")
            );

            await expect(
                PlaceTagService.processTagsFromForm([{ value: "new tag", label: "new tag" }])
            ).rejects.toThrow(BadRequestError);
        });

        it("should throw an App Error if an unspecified issue occurred", async () => {
            jest.spyOn(PlaceTagService, "getTagByName").mockRejectedValue(
                new Error("A random error")
            );

            await expect(
                PlaceTagService.processTagsFromForm([{ value: "new tag", label: "new tag" }])
            ).rejects.toThrow(AppError);
        });
    });
});
