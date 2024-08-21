import { NextResponse } from "next/server";
import { verifyJWT } from "./lib/authHandler";
import { updateSession, getSession } from "./lib/sessionHandler";

const SECRET = process.env.JWT_SECRET;

/** This Middleware file manages authorization for the various API and page routes of the application
 *
 *  - API Routes
 *   - The middleware(s) check for a Authorization: Bearer {Token} (JWT user session token)
 *   - For routes that are admin only, restrict to admins
 *
 *  - Page / Frontend Routes:
 *    - The middleware(s) check the user session to determine logged in status. Further authorization (ie for guide owner) is done in page handlers.
 *    - It refreshes / extends the user session
 *
 *  Note: The `request` param in the middleware functions is a NextRequest, exension of the JS Reqest object
 */

export async function middleware(request) {
    const path = request.nextUrl.pathname;

    //--- Handle API Routes ---//
    if (path.startsWith("/api")) {
        // parse token
        const token = request.headers.get("Authorization")?.split(" ")[1];
        const user = token ? await verifyJWT(token, SECRET) : undefined;
        const requestHeaders = new Headers(request.headers);

        // must be an admin to access any api routes except for /api/auth
        if (!path.startsWith("/api/auth")) {
            if (!user || !user.isAdmin) {
                return new Response(
                    JSON.stringify({ error: "Forbidden: Must provide current admin token." }),
                    {
                        status: 403,
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
            }
        }

        // Proceed to requested /api route
        return NextResponse.next();
    }

    //--- Handle Page Routes ---//
    const user = await getSession();

    // For all requests to page routes, update the user session cookie if there is one
    let response = await updateSession(request); // response is now a NextResponse

    // Ensure user is logged in for these routes:
    if (
        path.startsWith("/guides/new") ||
        path.match(/^\/guides\/\d+\/edit$/) || // /guides/[id]/edit
        path.match(/^\/guides\/\d+\/share$/) || // /guides/[id]/share
        path.match(/^\/guides\/\d+\/delete$/) || // /guides/[id]/delete
        path.match(/^\/guides\/\d+\/places/) || // /guides/[id]/delete
        path.startsWith("/profile")
    ) {
        if (!user) {
            return NextResponse.redirect(new URL("/auth/login?alert=not-authorized", request.url));
        }
    }

    // Ensure user is logged out for these routes:
    if (path.startsWith("/auth")) {
        if (user) {
            return NextResponse.redirect(new URL("/?alert=already-logged-in", request.url));
        }
    }

    // Proceed to originally requested route
    return response;
}

export const config = {
    /*
     * Match all paths except for:
     * 1. /_next/ (Next.js internals)
     * 2. /_static (inside /public)
     * 3. /_vercel (Vercel internals)
     * 4. Static files (e.g. /favicon.ico, /sitemap.xml, /robots.txt, etc.)
     */
    matcher: ["/((?!_next/|_static|_vercel|[\\w-]+\\.\\w+).*)"],
};
