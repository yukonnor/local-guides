import GuidePlaceService from "@/services/GuidePlaceService";
import { returnValidationError } from "@/utils/errors";
import { placeUpdateValidate } from "@/schemas/ajvSetup";

/** Handle PATCH request | /api/guides/[id]/places/[placeId]
 *
 *  Request body: { description, recType }
 *  Response: { guidePlace }
 *
 *  Authorization required:
 *    - admin token (handled by middleware)
 *
 *  TODO: Verify place updated is associated with guide?
 */

export async function PATCH(request, { params }) {
    try {
        // get info from body of PATCH request
        const body = await request.json();

        // validate JSON
        const valid = placeUpdateValidate(body);
        if (!valid) return returnValidationError(placeUpdateValidate.errors);

        const guidePlace = await GuidePlaceService.updateGuidePlace(params.placeId, body);
        return Response.json(guidePlace);
    } catch (err) {
        return Response.json({ error: err.message }, { status: err.status });
    }
}

/** Handle DELETE request | /api/guides/[id]/places/[placeId]
 *
 *  Request body: n/a
 *  Response: { deleted }
 *
 *  Authorization required:
 *    - admin token (handled by middleware)
 *
 *  TODO: Verify place deleted is associated with guide?
 */

export async function DELETE(request, { params }) {
    try {
        const deletedGuidePlace = await GuidePlaceService.deleteGuidePlace(params.placeId);
        return new Response(
            JSON.stringify({
                deleted: `Removed place ${deletedGuidePlace.id} from guide ${deletedGuidePlace.guideId}.`,
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
