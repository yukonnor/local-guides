import UserService from "@/services/UserService";
import { signJWT } from "@/lib/authHandler";
import { returnValidationError } from "@/utils/errors";
import { userRegisterValidate } from "@/schemas/ajvSetup";

const SECRET = process.env.JWT_SECRET;

/** Handle POST request | /api/auth/register
 *
 *  Request body: { username, password, email }
 *  Response: { token }
 *
 *  Note: this route cannot be used to create admin users.
 *        to create admins use POST /api/users
 *
 *  Authorization required: n/a (public)
 */

export async function POST(request) {
    const body = await request.json();

    // validate JSON
    const valid = userRegisterValidate(body);
    if (!valid) return returnValidationError(userRegisterValidate.errors);

    try {
        const user = await UserService.registerUser(body);
        const token = await signJWT(
            {
                id: user.id,
                username: user.username,
                isAdmin: user.isAdmin,
            },
            SECRET
        );
        return Response.json({ token });
    } catch (err) {
        return Response.json({ error: err.message }, { status: err.status || 500 });
    }
}
