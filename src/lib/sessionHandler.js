"use server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyJWT, signJWT } from "./authHandler";

const SECRET = process.env.JWT_SECRET;

/** setSession()
 *
 *  This function sets the user session cookie on the front end give authenticated user info.
 *  NOTE: userData should only contain non-sensitive / identifying user attributes
 *
 */

export async function setSession(token) {
    const session = token;

    // Save the session in a cookie
    cookies().set("session", session, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
    });
    return;
}

// getSession() gets the session token from the session cookie and parses it

export async function getSession() {
    const session = cookies().get("session")?.value;
    if (!session) return null;

    const sessionPayload = await verifyJWT(session, SECRET);
    return sessionPayload;
}

// updateSession() runs in middleware to add time to session as user is making requests.
// Takes the current request being handled by the middleware as a param.

export async function updateSession(request) {
    const session = request.cookies.get("session")?.value;

    if (!session) {
        return NextResponse.next();
    }

    // Refresh the session so it doesn't expire
    const parsed = await verifyJWT(session, SECRET);

    if (parsed) {
        parsed["exp"] = new Date(Date.now() + 1000 * 60 * 60 * 24); // add 24h
        const res = NextResponse.next();
        res.cookies.set({
            name: "session",
            value: await signJWT(parsed, SECRET),
            httpOnly: true,
        });

        // proceed to requested route with updated session cookie
        return res;
    }
}

// destroySession() clears out the session cookie, logging the user out from the frontend app

export async function destroySesion() {
    cookies().set("session", "", { expires: new Date(0) });
}
