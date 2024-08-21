"use server";
import { SignJWT, jwtVerify } from "jose";
import { setSession, destroySesion } from "./sessionHandler";
import fetch from "node-fetch";

const SERVER = process.env.SERVER;

export async function signJWT(payload, secret) {
    // Check if the secret is provided
    if (!secret) {
        throw new Error("No secret provided for signing the JWT");
    }

    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + 60 * 60 * 24; // 24 hours

    try {
        const token = await new SignJWT({ ...payload })
            .setProtectedHeader({ alg: "HS256", typ: "JWT" })
            .setExpirationTime(exp)
            .setIssuedAt()
            .sign(new TextEncoder().encode(secret));

        return token;
    } catch (err) {
        console.error(`Error in authHandler.signJWT: ${err.message}`);
        throw err;
    }
}

export async function verifyJWT(token, secret) {
    try {
        const { payload } = await jwtVerify(token, new TextEncoder().encode(secret), {
            algorithms: ["HS256"],
        });
        return payload;
    } catch (err) {
        // if known verification error, don't log
        if (err.message.includes("exp")) {
            return null;
        }

        console.error(`Error in authHandler.verifyJWT: ${err.message}`);
        return null;
    }
}

/** login()
 *
 *  This function handles authentication and session creation Login form(s) on the frontend.
 */

export async function login(username, password) {
    // Verify credentials && get the user token from the API
    const response = await fetch(`${SERVER}/api/auth/login`, {
        method: "POST",
        body: JSON.stringify({
            username,
            password,
        }),
    });

    if (!response.ok) {
        throw new Error("Username or password incorrect.");
    }
    const { token } = await response.json();

    // Create the session
    if (token) {
        return setSession(token);
    }
}

/** logout()
 *
 *  This function handles logout from Logout form(s) on the frontend.
 */

export async function logout() {
    // Destroy the session
    destroySesion();
}
