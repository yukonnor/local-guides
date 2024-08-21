/**
 * @jest-environment node
 */

import { handleEditPlace, getTagSuggestions } from "@/app/actions/guides/places/handleEditPlace";
import GuidePlaceService from "@/services/GuidePlaceService";
import PlaceTagService from "@/services/PlaceTagService";
const { commonAfterAll } = require("../../../testCommon");

// Mock the GuidePlaceService and PlaceTagService methods
jest.mock("@/services/GuidePlaceService", () => ({
    updateGuidePlace: jest.fn(),
}));

jest.mock("@/services/PlaceTagService", () => ({
    processTagsFromForm: jest.fn(),
    deleteTagsFromPlace: jest.fn(),
    addTagsToPlace: jest.fn(),
    getTags: jest.fn(),
}));

afterAll(commonAfterAll);

describe("handleEditPlace", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should successfully edit a place with tags", async () => {
        const placeId = "place123";
        const formData = {
            description: "A beautiful place",
            recType: "Park",
            tags: [
                { value: 1, label: "Nature" },
                { value: "NewTag", label: "NewTag" },
            ],
        };

        const tagIds = [1, "NewTagId"];
        const addedTags = [
            { value: 1, label: "Nature" },
            { value: "NewTagId", label: "NewTag" },
        ];
        const edittedPlace = {
            id: placeId,
            description: formData.description,
            recType: formData.recType,
            tags: addedTags,
        };

        PlaceTagService.processTagsFromForm.mockResolvedValue(tagIds);
        PlaceTagService.deleteTagsFromPlace.mockResolvedValue();
        PlaceTagService.addTagsToPlace.mockResolvedValue(addedTags);
        GuidePlaceService.updateGuidePlace.mockResolvedValue(edittedPlace);

        const result = await handleEditPlace(placeId, formData);

        expect(PlaceTagService.processTagsFromForm).toHaveBeenCalledWith(formData.tags);
        expect(PlaceTagService.deleteTagsFromPlace).toHaveBeenCalledWith(placeId);
        expect(PlaceTagService.addTagsToPlace).toHaveBeenCalledWith(placeId, tagIds);
        expect(GuidePlaceService.updateGuidePlace).toHaveBeenCalledWith(placeId, {
            description: formData.description,
            recType: formData.recType,
        });
        expect(result).toEqual(edittedPlace);
    });

    it("should handle errors when editing a place", async () => {
        const placeId = "place123";
        const formData = {
            description: "A beautiful place",
            recType: "Park",
            tags: [{ value: 1, label: "Nature" }],
        };

        const error = new Error("Failed to edit place");

        PlaceTagService.processTagsFromForm.mockRejectedValue(error);

        await expect(handleEditPlace(placeId, formData)).rejects.toThrow(error);
    });
});

describe("getTagSuggestions", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should successfully get tag suggestions", async () => {
        const tags = [
            { id: 1, name: "Nature" },
            { id: 2, name: "Adventure" },
        ];
        const tagSuggestions = tags.map((tag) => ({ value: tag.id, label: tag.name }));

        PlaceTagService.getTags.mockResolvedValue(tags);

        const result = await getTagSuggestions();

        expect(PlaceTagService.getTags).toHaveBeenCalled();
        expect(result).toEqual(tagSuggestions);
    });

    it("should handle errors when getting tag suggestions", async () => {
        const error = new Error("Failed to get tags");

        PlaceTagService.getTags.mockRejectedValue(error);

        await expect(getTagSuggestions()).rejects.toThrow(error);
    });
});
