"use server";
import { redirect } from "next/navigation";
import UserService from "@/services/UserService";
import { createToastCookie } from "@/app/actions/cookieActions";

// Handle submit from ProfileEditForm
export async function handleUserEdit(userId, formData) {
    const username = formData.get("username");
    const email = formData.get("email");

    let edited = false;

    try {
        const editedUser = await UserService.updateUser(userId, { username, email });
        await createToastCookie("success", "Successfully updated your account.");
        edited = true;
    } catch (err) {
        console.error(`Error in actions.handleUserEdit: ${err.message}.`);
        if (parseInt(err.code) === 23505) {
            err.message = "That username is taken.";
        } else if (parseInt(err.code) === 23514) {
            err.message = "Please provide a valid email address.";
        }
        await createToastCookie("error", err.message);
    }

    // once done, redirect to profile page:
    if (edited) redirect(`/profile/${userId}`);
}
