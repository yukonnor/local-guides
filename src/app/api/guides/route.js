import GuideService from "@/services/GuideService";
import { BadRequestError, returnValidationError } from "@/utils/errors";
import { guideCreateValidate } from "@/schemas/ajvSetup";
import { isValidLatitude, isValidLongitude } from "@/utils/helpers";

/** Handle GET request | /api/guides
 *
 *  Request body: n/a
 *  Response: [{guide}, {guide}, ...]
 *
 *  Authorization required: admin token (handled by middleware)
 */

export async function GET(request) {
    // TODO add LIMIT and OFFSET handling
    const params = request.nextUrl.searchParams;

    // See if lat / long data provided in query params
    const lat = params.get("lat");
    const long = params.get("long");

    try {
        // If lat / long provided but invalid, throw error
        if (lat || long) {
            if (!isValidLatitude(lat) || !isValidLongitude(long)) {
                throw new BadRequestError("Invalid latitude or longitude values");
            }
        }

        // If lat and long provided, return nearby guides
        if (lat && long) {
            if (isValidLatitude(lat) && isValidLongitude(long)) {
                const response = await GuideService.getGuidesByLatLong(lat, long);
                return Response.json(response);
            }
        }

        // Else, return all guides
        const response = await GuideService.getGuides();
        return Response.json(response);
    } catch (err) {
        return Response.json(
            {
                error: err.message,
            },
            {
                status: err.status || 500,
            }
        );
    }
}

/** Handle POST request | /api/guides
 *
 *  Request body: { authorId, googlePlaceId, title, isPrivate, latitude, longitude }
 *  Response: { guide }
 *
 *  Authorization required: admin token (handled by middleware)
 */

export async function POST(request) {
    // get guide data from POST request body
    const body = await request.json();

    // validate JSON
    const valid = guideCreateValidate(body);
    if (!valid) return returnValidationError(guideCreateValidate.errors);

    try {
        const newGuide = await GuideService.addGuide(body);
        return Response.json(newGuide);
    } catch (err) {
        return Response.json({ error: err.message }, { status: err.status || 500 });
    }
}
