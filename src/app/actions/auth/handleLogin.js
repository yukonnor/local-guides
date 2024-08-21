"use server";
import { redirect } from "next/navigation";
import { login } from "@/lib/authHandler";
import { createToastCookie } from "@/app/actions/cookieActions";

export async function handleLogin(formData) {
    const username = formData.get("username");
    const password = formData.get("password");

    let loggedIn = false;

    try {
        await login(username, password);
        await createToastCookie("success", "Welcome back!", "👋");
        loggedIn = true;
    } catch (err) {
        console.error(`Error in actions.handleLogin: ${err.message}.`);
        await createToastCookie("error", err.message);
    }

    if (loggedIn) redirect("/");
}
