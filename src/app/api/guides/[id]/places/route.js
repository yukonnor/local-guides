import GuidePlaceService from "@/services/GuidePlaceService";
import { returnValidationError } from "@/utils/errors";
import { placeCreateValidate } from "@/schemas/ajvSetup";

/** Handle GET request | /api/guides/[id]/places
 *
 *  Request body: n/a
 *  Response: [{place}, {place}]
 *
 *  Authorization required:
 *  - admin token (handled by middleware)
 */

export async function GET(request, { params }) {
    try {
        const places = await GuidePlaceService.getGuidePlacesByGuideId(params.id);
        return Response.json(places);
    } catch (err) {
        console.error(err);
        return Response.json({ error: err.message }, { status: err.status || 500 });
    }
}

/** Handle POST request | /api/guides/[id]/places
 *
 *  Request body: { place }
 *  Response: { addedPlace: place }
 *
 *  Authorization required:
 *    - current admin token (handled by middleware)
 */

export async function POST(request, { params }) {
    try {
        const body = await request.json();

        // validate JSON
        const valid = placeCreateValidate(body);
        if (!valid) return returnValidationError(placeCreateValidate.errors);

        const place = await GuidePlaceService.addGuidePlace(params.id, body);

        return Response.json({ addedPlace: place });
    } catch (err) {
        return Response.json({ error: err.message }, { status: err.status || 500 });
    }
}
