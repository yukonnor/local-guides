"use server";
import { redirect } from "next/navigation";
import { logout } from "@/lib/authHandler";
import { createToastCookie } from "@/app/actions/cookieActions";

// Handle submit from Logout Form
export async function handleLogout() {
    let loggedOut = false;
    try {
        await logout();
        await createToastCookie("success", "Successfully logged out!");
        loggedOut = true;
    } catch (err) {
        console.error(`Error in actions.handleLogout: ${err.message}.`);
        await createToastCookie("error", "Error: Could not log out.");
    }

    if (loggedOut) redirect("/");
}
