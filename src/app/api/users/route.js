import UserService from "@/services/UserService";
import { returnValidationError } from "@/utils/errors";
import { userCreateValidate } from "@/schemas/ajvSetup";
import { signJWT } from "@/lib/authHandler";
const SECRET = process.env.JWT_SECRET;

/** Handle GET request | /api/admin/users
 *
 *  Request body: n/a
 *  Response: [{user}, {user}, ...]
 *
 *  Authorization required: admin (handled by middleware)
 */

export async function GET(request) {
    // TODO add LIMIT and OFFSET handling
    try {
        const response = await UserService.getUsers();
        return Response.json(response);
    } catch (err) {
        const statusCode = err.status || 500;
        return Response.json({ error: err.message }, { status: statusCode });
    }
}

/** Handle POST request | /api/admin/users
 *  Note: This is not the registration endpoint! Instead, this is
 *  only for admin users to add new users. The new user being added can be an
 *  admin.
 *
 *  Request body: { username, password, email, isAdmin }
 *  Response: {user: { username, email, isAdmin }, token }
 *
 *  Authorization required: admin (handled by middleware)
 */

export async function POST(request) {
    const body = await request.json();

    // validate JSON
    const valid = userCreateValidate(body);
    if (!valid) return returnValidationError(userCreateValidate.errors);

    try {
        const newUser = await UserService.registerUser(body);
        return Response.json({ user: newUser, token: await signJWT(newUser, SECRET) });
    } catch (err) {
        const statusCode = err.status || 500;
        return Response.json({ error: err.message }, { status: statusCode });
    }
}
