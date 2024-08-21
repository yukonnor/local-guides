"use server";
import { redirect } from "next/navigation";
import { signJWT } from "@/lib/authHandler";
import UserService from "@/services/UserService";
import { createToastCookie } from "@/app/actions/cookieActions";
import { setSession } from "@/lib/sessionHandler";

const SECRET = process.env.JWT_SECRET;

export async function handleRegister(formData) {
    const username = formData.get("username");
    const password = formData.get("password");
    const email = formData.get("email");

    let registered = false;

    try {
        const newUser = await UserService.registerUser({
            username,
            password,
            email,
        });

        const token = await signJWT(
            {
                id: newUser.id,
                username: newUser.username,
                isAdmin: newUser.isAdmin,
            },
            SECRET
        );

        setSession(token);
        await createToastCookie("success", `Welcome to Local Guides, ${username}!`, "👋");
        registered = true;
    } catch (err) {
        console.error(`Error in actions.handleRegister: ${err.message}.`);
        if (parseInt(err.code) === 23505) {
            err.message = "That username is taken.";
        } else if (parseInt(err.code) === 23514) {
            err.message = "Please provide a valid email address.";
        }

        await createToastCookie("error", err.message);
    }

    if (registered) redirect("/");
}
