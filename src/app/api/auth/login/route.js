import UserService from "@/services/UserService";
import { signJWT } from "@/lib/authHandler";
import { returnValidationError } from "@/utils/errors";
import { userLoginValidate } from "@/schemas/ajvSetup";

const SECRET = process.env.JWT_SECRET;

/** Handle POST request | /api/auth/login
 *
 *  Request body: { username, password }
 *  Response: { token }
 *
 *  Authorization required: n/a (public)
 */

export async function POST(request) {
    const body = await request.json();

    // validate JSON
    const valid = userLoginValidate(body);
    if (!valid) return returnValidationError(userLoginValidate.errors);

    try {
        const user = await UserService.authenticateUser(body.username, body.password);
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
