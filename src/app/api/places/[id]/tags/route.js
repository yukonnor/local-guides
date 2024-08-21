import PlaceTagService from "@/services/PlaceTagService";
import { returnValidationError } from "@/utils/errors";
import { tagValidate } from "@/schemas/ajvSetup";

/** Handle GET request | /api/admin/places/[id]/tags
 *
 *  Request body: n/a
 *  Response: [{tag}, {tag}]
 *
 *  Authorization required:
 *   - admin token (handled by middleware)
 */

export async function GET(request, { params }) {
    try {
        const tags = await PlaceTagService.getTagsByPlaceId(params.id);
        return Response.json(tags);
    } catch (err) {
        return Response.json({ error: err.message }, { status: err.status || 500 });
    }
}

/** Handle POST request | /api/admin/places/[id]/tags
 *
 *  Request body: { name }
 *  Response: { addedTag: {plaecId, tag} }
 *
 *  Authorization required:
 *    - admin token (handled by middleware) *
 */

export async function POST(request, { params }) {
    try {
        const body = await request.json();

        // validate JSON
        const valid = tagValidate(body);
        if (!valid) return returnValidationError(tagValidate.errors);

        // get tag id from tag name
        const tag = await PlaceTagService.getTagByName(body.name);

        // attempt to assign tag to place
        const placeTag = await PlaceTagService.addTagToPlace(params.id, tag.id);

        return Response.json({ addedTag: { placeId: params.id, tag: tag.name } });
    } catch (err) {
        return Response.json({ error: err.message }, { status: err.status || 500 });
    }
}
