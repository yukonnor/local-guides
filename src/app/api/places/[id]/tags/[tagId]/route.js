import PlaceTagService from "@/services/PlaceTagService";

/** Handle DELETE request | /api/places/[id]/tags/[tagId]
 *
 *  Request body: n/a
 *  Response: { deleted }
 *
 *  Authorization required:
 *    - admin token (handled by middleware)
 */

export async function DELETE(request, { params }) {
    try {
        const deletedPlaceTag = await PlaceTagService.deleteTagFromPlace(params.id, params.tagId);
        return new Response(
            JSON.stringify({
                deleted: `Removed tag ${deletedPlaceTag.tagId} from place ${deletedPlaceTag.placeId}.`,
            }),
            {
                headers: {
                    "Content-Type": "application-json",
                },
                status: 200,
            }
        );
    } catch (err) {
        return Response.json({ error: err.message }, { status: err.status });
    }
}
