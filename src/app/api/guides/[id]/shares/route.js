import GuideShareService from "@/services/GuideShareService";
import { returnValidationError } from "@/utils/errors";
import { guideShareValidate } from "@/schemas/ajvSetup";

/** Handle GET request | /api/guides/[id]/shares
 *
 *  Request body: n/a
 *  Response: [{userId}, {userId}]
 *
 *  Authorization required:
 *    - admin token (handled by middleware)
 */

export async function GET(request, { params }) {
    try {
        const shares = await GuideShareService.getSharesByGuideId(params.id);
        return Response.json(shares);
    } catch (err) {
        return Response.json({ error: err.message }, { status: err.status || 500 });
    }
}

/** Handle POST request | /api/guides/[id]/shares
 *
 *  Request body: { email }
 *  Response: { addedShare: {id, guideId, email, createdAt}}
 *
 *  Authorization required:
 *      - admin token (handled by middleware)
 */

export async function POST(request, { params }) {
    const body = await request.json();

    try {
        // validate JSON
        const valid = guideShareValidate(body);
        if (!valid) return returnValidationError(guideShareValidate.errors);

        const guideShare = await GuideShareService.addShareToGuide(params.id, body.email);

        return Response.json({
            addedShare: { id: guideShare.id, guideID: guideShare.guideId, email: guideShare.email },
        });
    } catch (err) {
        return Response.json({ error: err.message }, { status: err.status || 500 });
    }
}
