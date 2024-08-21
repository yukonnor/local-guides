import { searchPlaces, searchLocalities } from "@/lib/api/googlePlaces";
import { returnValidationError } from "@/utils/errors";
import { googleSearchPlaceValidate } from "@/schemas/ajvSetup";
import { isValidLatitude, isValidLongitude } from "@/utils/helpers";

/** Handle POST request | /api/google/search-places
 *
 *  Makes a request to the Google Places API and returns places
 *
 *  Request body: { placeType ['place' or 'locality'], textQuery, latitude, longitude }
 *  Response: [{ place }, { place }, ...]
 *
 *  Authorization required: current admin token (handled by middleware)
 */

export async function POST(request) {
    // get guide data from POST request body
    const body = await request.json();
    const { placeType, textQuery } = body;
    const latitude = body?.latitude;
    const longitude = body?.longitude;

    // validate JSON
    const valid = googleSearchPlaceValidate(body);
    if (!valid) return returnValidationError(googleSearchPlaceValidate.errors);

    let placeResults = [];

    try {
        if (placeType === "locality") {
            placeResults = await searchLocalities(textQuery);
        }

        if (placeType === "place" && isValidLatitude(latitude) && isValidLongitude(longitude)) {
            placeResults = await searchPlaces(textQuery);
        }

        return Response.json(placeResults);
    } catch (err) {
        console.error(err);
        return Response.json({ error: err.message }, { status: err.status });
    }
}
