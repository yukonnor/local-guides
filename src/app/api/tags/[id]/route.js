import PlaceTagService from "@/services/PlaceTagService";

/** Handle GET request | /api/admin/place-tags/[id]
 *
 *  Request body: n/a
 *  Response: {tag}
 *
 *  Authorization required: admin (handled by middleware)
 */

export async function GET(request, { params }) {
    try {
        const tag = await PlaceTagService.getTagById(params.id);
        return Response.json(tag);
    } catch (err) {
        return Response.json({ error: err.message }, { status: err.status || 500 });
    }
}

/** Handle PATCH request | /api/admin/place-tags/[id]
 *
 *  Request body: {name}
 *  Response: {tag}
 *
 *  Authorization required: admin (handled by middleware)
 */

export async function PATCH(request, { params }) {
    try {
        const body = await request.json();
        const tag = await PlaceTagService.updateTag(params.id, body);
        return Response.json(tag);
    } catch (err) {
        return Response.json({ error: err.message }, { status: err.status || 500 });
    }
}

/** Handle DELETE request | /api/admin/place-tags/[id]
 *
 *  Request body: n/a
 *  Response: {deleted}
 *
 *  Authorization required: admin (handled by middleware)
 */

export async function DELETE(request, { params }) {
    try {
        const deletedTag = await PlaceTagService.deleteTag(params.id);
        return new Response(JSON.stringify({ deleted: deletedTag.id }), {
            headers: {
                "Content-Type": "application-json",
            },
            status: 200,
        });
    } catch (err) {
        return Response.json({ error: err.message }, { status: err.status || 500 });
    }
}
