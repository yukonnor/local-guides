"use server";
import { cookies } from "next/headers";

const TOAST_COOKIE_NAME = process.env.TOAST_COOKIE_NAME;

/** createLocalityCookie(type, message, [icon])
 *
 *  Creates a cookie used to temporarily set a locality that the user searched for.
 *  This lets other pages pull data about the locality without having to make a new Google API request.
 *
 */

export async function createLocalityCookie(locality) {
    cookies().set({
        name: "locality",
        value: JSON.stringify(locality),
        httpOnly: true,
        secure: true,
        path: "/",
    });
}

/** createToastCookie(type, message, [icon])
 *
 *  Creates a cookie used to display toasts / alerts to users.
 *  Omitting the icon argument will display the default toast icon.
 *  example: createToastCookie("success", "Welcome back!", "👋")
 *
 */

export async function createToastCookie(type, message, icon) {
    if (type === "" || message === "") return;

    // Try setting toast cookie
    const toastObj = { type, message, icon };

    cookies().set({
        name: TOAST_COOKIE_NAME,
        value: JSON.stringify(toastObj),
        httpOnly: true,
        secure: true,
        path: "/",
    });
}

/** removeToastCookie()
 *
 *  Removes the toast cookie after the toast is rendered.
 *
 */

export async function removeToastCookie() {
    cookies().delete(TOAST_COOKIE_NAME);
}
