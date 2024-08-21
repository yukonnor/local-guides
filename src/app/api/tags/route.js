import PlaceTagService from "@/services/PlaceTagService";

/** Handle GET request | /api/admin/place-tags
 *
 *  Request body: n/a
 *  Response: [{tag}, {tag}, ...]
 *
 *  Authorization required: admin token (handled by middleware)
 */

export async function GET(request) {
    // TODO add LIMIT and OFFSET handling
    try {
        const response = await PlaceTagService.getTags();
        return Response.json(response);
    } catch (err) {
        return Response.json({ error: err.message }, { status: err.status || 500 });
    }
}

/** Handle POST request | /api/admin/place-tags
 *
 *  Request body: { name }
 *  Response: { tag }
 *
 *  Authorization required: admin token (handled by middleware)
 */

export async function POST(request) {
    const body = await request.json();

    try {
        const newTag = await PlaceTagService.addTag(body);
        return Response.json(newTag);
    } catch (err) {
        return Response.json({ error: err.message }, { status: err.status || 500 });
    }
}
