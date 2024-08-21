import { getPlaceData } from "@/lib/api/googlePlaces";

/** Handle GET request | /api/google/place/[id]
 *
 *  Makes a request to the Google Places API and returns place data given a place ID
 *
 *  Request body: n/a
 *  Response: { place }
 *
 *  Authorization required: current admin token (handled by middleware)
 */

export async function GET(request, { params }) {
    try {
        const place = await getPlaceData(params.id);
        return Response.json(place);
    } catch (err) {
        return Response.json({ error: err.message }, { status: err.status });
    }
}
