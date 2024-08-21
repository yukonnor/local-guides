/**
 * @jest-environment node
 */

import { GET, POST } from "@/app/api/places/[id]/tags/route.js";
import PlaceTagService from "@/services/PlaceTagService";
import { returnValidationError } from "@/utils/errors";
import { tagValidate } from "@/schemas/ajvSetup";
import { commonAfterAll } from "../testCommon";

jest.mock("@/services/PlaceTagService", () => ({
    getTagsByPlaceId: jest.fn(),
    getTagByName: jest.fn(),
    addTagToPlace: jest.fn(),
}));

jest.mock("@/utils/errors", () => ({
    returnValidationError: jest.fn(),
}));

jest.mock("@/schemas/ajvSetup", () => ({
    tagValidate: jest.fn(),
}));

afterAll(commonAfterAll);

describe("GET /api/admin/places/[id]/tags", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return tags on success", async () => {
        const placeId = "place123";
        const mockTags = [{ name: "tag1" }, { name: "tag2" }];

        PlaceTagService.getTagsByPlaceId.mockResolvedValue(mockTags);

        const request = {};
        const params = { id: placeId };

        const response = await GET(request, { params });
        const responseBody = await response.json();

        expect(response.status).toBe(200);
        expect(responseBody).toEqual(mockTags);
    });

    it("should return an error on failure", async () => {
        const placeId = "place123";
        const errorMessage = "Unable to fetch tags";

        PlaceTagService.getTagsByPlaceId.mockRejectedValue(new Error(errorMessage));

        const request = {};
        const params = { id: placeId };

        const response = await GET(request, { params });
        const responseBody = await response.json();

        expect(response.status).toBe(500);
        expect(responseBody).toEqual({ error: errorMessage });
    });
});

describe("POST /api/admin/places/[id]/tags", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should add a tag to place and return success on valid input", async () => {
        const placeId = "place123";
        const tagName = "Sample Tag";
        const tagId = "tag123";
        const mockTag = { id: tagId, name: tagName };
        const requestBody = { name: tagName };

        tagValidate.mockReturnValue(true);
        PlaceTagService.getTagByName.mockResolvedValue(mockTag);
        PlaceTagService.addTagToPlace.mockResolvedValue({ placeId, tagId });

        const request = {
            json: jest.fn().mockResolvedValue(requestBody),
        };

        const response = await POST(request, { params: { id: placeId } });
        const responseBody = await response.json();

        expect(response.status).toBe(200);
        expect(responseBody).toEqual({ addedTag: { placeId, tag: tagName } });
    });

    it("should return a validation error if tagValidate fails", async () => {
        const validationErrors = [{ message: "Invalid data" }];

        tagValidate.mockReturnValue(false);
        returnValidationError.mockImplementation(
            () => new Response(JSON.stringify({ errors: ["Invalid data"] }), { status: 400 })
        );
        tagValidate.errors = validationErrors;

        const request = {
            json: jest.fn().mockResolvedValue({ name: "" }), // Invalid input
        };

        const response = await POST(request, { params: { id: "place123" } });
        const responseBody = await response.json();

        expect(response.status).toBe(400);
        expect(responseBody).toEqual({ errors: ["Invalid data"] });
        expect(returnValidationError).toHaveBeenCalledWith(validationErrors);
    });

    it("should return an error if adding tag to place fails", async () => {
        const errorMessage = "Tag addition failed";
        const requestBody = { name: "Sample Tag" };

        tagValidate.mockReturnValue(true);
        PlaceTagService.getTagByName.mockResolvedValue({ id: "tag123", name: "Sample Tag" });
        PlaceTagService.addTagToPlace.mockRejectedValue(new Error(errorMessage));

        const request = {
            json: jest.fn().mockResolvedValue(requestBody),
        };

        const response = await POST(request, { params: { id: "place123" } });
        const responseBody = await response.json();

        expect(response.status).toBe(500);
        expect(responseBody).toEqual({ error: errorMessage });
    });
});
