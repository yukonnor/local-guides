"use server";
import { redirect } from "next/navigation";
import GuideService from "@/services/GuideService";
import { createToastCookie } from "@/app/actions/cookieActions";

// Handle submit from GuideEditForm
export async function handleEditGuide(guideId, formData) {
    let edited = false;

    const title = formData.get("title");
    const description = formData.get("description");
    const isPrivate = formData.get("isPrivate") ? true : false;

    if (!title.length) {
        await createToastCookie("error", "Provide a title for your guide.");
        return;
    }

    try {
        // send form data to Guides service
        await GuideService.updateGuide(guideId, {
            title,
            description,
            isPrivate,
        });

        // TODO: Cookie creation interfering with redirect
        // createToastCookie("success", "Successfully edited guide.");
        edited = true;
    } catch (err) {
        console.error(`Error in actions.handleEditGuide: ${err.message}.`);
        await createToastCookie("error", err.message);
    }

    if (edited) redirect(`/guides/${guideId}`);
}
