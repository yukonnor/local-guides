import GuideShareService from "@/services/GuideShareService";

/** Handle DELETE request | /api/guides/[id]/shares/[shareId]
 *
 *  Request body: n/a
 *  Response: { deleted: {removedShareId} }
 *
 *  Authorization required:
 *    - admin token (handled by middleware)
 */

export async function DELETE(request, { params }) {
    try {
        const removedShareId = await GuideShareService.deleteShareFromGuide(
            params.shareId,
            params.id
        );

        return new Response(JSON.stringify({ deleted: { id: removedShareId.id } }), {
            headers: {
                "Content-Type": "application-json",
            },
            status: 200,
        });
    } catch (err) {
        return Response.json({ error: err.message }, { status: err.status });
    }
}
