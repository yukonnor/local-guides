"use server";
import { redirect } from "next/navigation";
import { logout } from "@/lib/authHandler";
import UserService from "@/services/UserService";
import { createToastCookie } from "@/app/actions/cookieActions";

// Handle submit from ProfileDeleteForm
export async function handleUserDelete(userId) {
    let deleted = false;
    try {
        await UserService.deleteUser(userId);
        await logout();
        await createToastCookie("success", "Successfully deleted your account.");
        deleted = true;
    } catch (err) {
        console.error(`Error in actions.handleUserDelete: ${err.message}.`);
        await createToastCookie("error", "Error: Could not delete account.");
    }

    if (deleted) redirect(`/`);
}
