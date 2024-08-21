/**
 * @jest-environment node
 */

import { GET, PATCH, DELETE } from "@/app/api/tags/[id]/route";
import PlaceTagService from "@/services/PlaceTagService";
import { commonAfterAll } from "../testCommon";

jest.mock("@/services/PlaceTagService", () => ({
    getTagById: jest.fn(),
    updateTag: jest.fn(),
    deleteTag: jest.fn(),
}));

afterAll(commonAfterAll);

describe("GET /api/admin/place-tags/[id]", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return a tag on success", async () => {
        const mockTag = { id: "tag1", name: "Tag 1" };

        PlaceTagService.getTagById.mockResolvedValue(mockTag);

        const request = {};
        const params = { id: "tag1" };

        const response = await GET(request, { params });
        const responseBody = await response.json();

        expect(response.status).toBe(200);
        expect(responseBody).toEqual(mockTag);
    });

    it("should return an error on failure", async () => {
        const errorMessage = "Unable to fetch tag";

        PlaceTagService.getTagById.mockRejectedValue(new Error(errorMessage));

        const request = {};
        const params = { id: "tag1" };

        const response = await GET(request, { params });
        const responseBody = await response.json();

        expect(response.status).toBe(500);
        expect(responseBody).toEqual({ error: errorMessage });
    });
});

describe("PATCH /api/admin/place-tags/[id]", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should update a tag and return success on valid input", async () => {
        const updatedTag = { id: "tag1", name: "Updated Tag" };

        PlaceTagService.updateTag.mockResolvedValue(updatedTag);

        const request = {
            json: jest.fn().mockResolvedValue({ name: "Updated Tag" }),
        };
        const params = { id: "tag1" };

        const response = await PATCH(request, { params });
        const responseBody = await response.json();

        expect(response.status).toBe(200);
        expect(responseBody).toEqual(updatedTag);
    });

    it("should return an error if updating tag fails", async () => {
        const errorMessage = "Tag update failed";

        PlaceTagService.updateTag.mockRejectedValue(new Error(errorMessage));

        const request = {
            json: jest.fn().mockResolvedValue({ name: "Updated Tag" }),
        };
        const params = { id: "tag1" };

        const response = await PATCH(request, { params });
        const responseBody = await response.json();

        expect(response.status).toBe(500);
        expect(responseBody).toEqual({ error: errorMessage });
    });
});

describe("DELETE /api/admin/place-tags/[id]", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should delete a tag and return success", async () => {
        const deletedTag = { id: "tag1" };

        PlaceTagService.deleteTag.mockResolvedValue(deletedTag);

        const request = {};
        const params = { id: "tag1" };

        const response = await DELETE(request, { params });
        const responseBody = await response.json();

        expect(response.status).toBe(200);
        expect(responseBody).toEqual({ deleted: deletedTag.id });
    });

    it("should return an error if deleting tag fails", async () => {
        const errorMessage = "Tag deletion failed";

        PlaceTagService.deleteTag.mockRejectedValue(new Error(errorMessage));

        const request = {};
        const params = { id: "tag1" };

        const response = await DELETE(request, { params });
        const responseBody = await response.json();

        expect(response.status).toBe(500);
        expect(responseBody).toEqual({ error: errorMessage });
    });
});
