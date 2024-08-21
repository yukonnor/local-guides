import UserService from "@/services/UserService";
import GuideShareService from "@/services/GuideShareService";
import { returnValidationError } from "@/utils/errors";
import { userUpdateValidate } from "@/schemas/ajvSetup";

/** Handle GET request | /api/users/[id]
 *
 *  Request body: n/a
 *  Response: {user}
 *
 *  Authorization required: admin (handled by middleware)
 */

export async function GET(request, { params }) {
    try {
        const user = await UserService.getUserById(params.id);

        // Get guides shared with user and append to user object
        const sharedGuides = await GuideShareService.getGuidesBySharedUserId(params.id);
        user["sharedGuides"] = sharedGuides;

        return Response.json(user);
    } catch (err) {
        const statusCode = err.status || 500;
        return Response.json({ error: err.message }, { status: statusCode });
    }
}

/** Handle PATCH request | /api/users/[id]
 *
 *  Request body (all optional): { username, password, email }
 *  Response: {user}
 *
 *  Authorization required: admin (handled by middleware)
 *
 *  Note: isAdmin can only be set during user registration by admins
 */

export async function PATCH(request, { params }) {
    try {
        const body = await request.json();

        // validate JSON
        const valid = userUpdateValidate(body);
        if (!valid) return returnValidationError(userUpdateValidate.errors);

        const user = await UserService.updateUser(params.id, body);
        return Response.json(user);
    } catch (err) {
        const statusCode = err.status || 500;
        return Response.json({ error: err.message }, { status: statusCode });
    }
}

/** Handle DELETE request | /api/users/[id]
 *
 *  Request body: n/a
 *  Response: {deleted}
 *
 *  Authorization required: admin or same user
 */

export async function DELETE(request, { params }) {
    try {
        const deletedUser = await UserService.deleteUser(params.id);
        return new Response(JSON.stringify({ deleted: deletedUser.id }), {
            headers: {
                "Content-Type": "application-json",
            },
            status: 200,
        });
    } catch (err) {
        const statusCode = err.status || 500;
        return Response.json({ error: err.message }, { status: statusCode });
    }
}
