import GuideService from "@/services/GuideService";
import { returnValidationError } from "@/utils/errors";
import { guideUpdateValidate } from "@/schemas/ajvSetup";

/** Handle GET request | /api/guides/[id]
 *
 *  Request body: n/a
 *  Response: { guide }
 *
 *  Authorization required:
 *   - admin token (handled by middleware)
 */

export async function GET(request, { params }) {
    try {
        const guide = await GuideService.getGuideById(params.id);
        return Response.json(guide);
    } catch (err) {
        return Response.json({ error: err.message }, { status: err.status || 500 });
    }
}

/** Handle PATCH request | /api/guides/[id]
 *
 *  Request body: { title, description, isPrivate }
 *  Response: { guide }
 *
 *  Authorization required:
 *    - admin token (handled by middleware)
 */

export async function PATCH(request, { params }) {
    try {
        // get info from body of PATCH request
        const body = await request.json();

        // validate JSON
        const valid = guideUpdateValidate(body);
        if (!valid) return returnValidationError(guideUpdateValidate.errors);

        const updatedGuide = await GuideService.updateGuide(params.id, body);
        return Response.json(updatedGuide);
    } catch (err) {
        return Response.json({ error: err.message }, { status: err.status || 500 });
    }
}

/** Handle DELETE request | /api/guides/[id]
 *
 *  Request body: n/a
 *  Response: { deleted }
 *
 *  Authorization required:
 *    - admin token (handled by middleware)
 */

export async function DELETE(request, { params }) {
    try {
        const deletedGuide = await GuideService.deleteGuide(params.id);
        return new Response(JSON.stringify({ deleted: deletedGuide.id }), {
            headers: {
                "Content-Type": "application-json",
            },
            status: 200,
        });
    } catch (err) {
        return Response.json({ error: err.message }, { status: err.status || 500 });
    }
}
