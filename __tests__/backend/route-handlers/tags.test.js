/**
 * @jest-environment node
 */

import { GET, POST } from "@/app/api/tags/route.js";
import PlaceTagService from "@/services/PlaceTagService";
import { commonAfterAll } from "../testCommon";

jest.mock("@/services/PlaceTagService", () => ({
    getTags: jest.fn(),
    addTag: jest.fn(),
}));

afterAll(commonAfterAll);

describe("GET /api/admin/place-tags", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return tags on success", async () => {
        const mockTags = [
            { id: "tag1", name: "Tag 1" },
            { id: "tag2", name: "Tag 2" },
        ];

        PlaceTagService.getTags.mockResolvedValue(mockTags);

        const request = {};

        const response = await GET(request);
        const responseBody = await response.json();

        expect(response.status).toBe(200);
        expect(responseBody).toEqual(mockTags);
    });

    it("should return an error on failure", async () => {
        const errorMessage = "Unable to fetch tags";

        PlaceTagService.getTags.mockRejectedValue(new Error(errorMessage));

        const request = {};

        const response = await GET(request);
        const responseBody = await response.json();

        expect(response.status).toBe(500);
        expect(responseBody).toEqual({ error: errorMessage });
    });
});

describe("POST /api/admin/place-tags", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should add a tag and return success on valid input", async () => {
        const newTag = { id: "tag123", name: "New Tag" };

        PlaceTagService.addTag.mockResolvedValue(newTag);

        const request = {
            json: jest.fn().mockResolvedValue({ name: "New Tag" }),
        };

        const response = await POST(request);
        const responseBody = await response.json();

        expect(response.status).toBe(200);
        expect(responseBody).toEqual(newTag);
    });

    it("should return an error if adding tag fails", async () => {
        const errorMessage = "Tag addition failed";

        PlaceTagService.addTag.mockRejectedValue(new Error(errorMessage));

        const request = {
            json: jest.fn().mockResolvedValue({ name: "New Tag" }),
        };

        const response = await POST(request);
        const responseBody = await response.json();

        expect(response.status).toBe(500);
        expect(responseBody).toEqual({ error: errorMessage });
    });
});
