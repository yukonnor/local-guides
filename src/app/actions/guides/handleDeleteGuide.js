"use server";
import { redirect } from "next/navigation";
import GuideService from "@/services/GuideService";
import { createToastCookie } from "@/app/actions/cookieActions";

// Handle submit from GuideDeleteForm
export async function handleDeleteGuide(guideId) {
    let deleted = false;

    try {
        const deletedGuide = await GuideService.deleteGuide(guideId);
        await createToastCookie("success", "Successfully deleted guide.");
        deleted = true;
    } catch (err) {
        console.error(`Error in actions.handleDeleteGuide: ${err.message}.`);
        await createToastCookie("error", err.message);
    }

    if (deleted) redirect(`/`);
}
