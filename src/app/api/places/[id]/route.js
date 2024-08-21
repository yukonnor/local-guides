import GuidePlaceService from "@/services/GuidePlaceService";
import { returnValidationError } from "@/utils/errors";
import { placeUpdateValidate } from "@/schemas/ajvSetup";

/** Handle GET request | /api/admin/places/[id]
 *
 *  Request body: n/a
 *  Response: { place }
 *
 *  Authorization required:
 *   - admin token (handled by middleware)
 */

export async function GET(request, { params }) {
    try {
        const place = await GuidePlaceService.getGuidePlaceById(params.id);
        return Response.json(place);
    } catch (err) {
        return Response.json({ error: err.message }, { status: err.status || 500 });
    }
}

/** Handle PATCH request | /api/admin/places/[id]
 *
 *  Request body: { description, recType }
 *  Response: { place }
 *
 *  Authorization required:
 *    - admin token (handled by middleware)
 */

export async function PATCH(request, { params }) {
    try {
        // get info from body of PATCH request
        const body = await request.json();

        // validate JSON
        const valid = placeUpdateValidate(body);
        if (!valid) return returnValidationError(placeUpdateValidate.errors);

        const place = await GuidePlaceService.updateGuidePlace(params.id, body);
        return Response.json(place);
    } catch (err) {
        return Response.json({ error: err.message }, { status: err.status || 500 });
    }
}

/** Handle DELETE request | /api/admin/places/[id]
 *
 *  Request body: n/a
 *  Response: { deleted }
 *
 *  Authorization required:
 *    - admin token (handled by middleware)
 */

export async function DELETE(request, { params }) {
    try {
        const deletedPlace = await GuidePlaceService.deleteGuidePlace(params.id);
        return new Response(JSON.stringify({ deleted: deletedPlace.id }), {
            headers: {
                "Content-Type": "application-json",
            },
            status: 200,
        });
    } catch (err) {
        return Response.json({ error: err.message }, { status: err.status || 500 });
    }
}
