"use server";
import { redirect } from "next/navigation";
import GuideService from "@/services/GuideService";
import { getPlaceData } from "@/lib/api/googlePlaces";
import { createToastCookie } from "@/app/actions/cookieActions";

// Handle submit of the GuideCreateForm
export async function handleGuideCreate(userId, gpId, formData) {
    let created = false;
    let newGuide = {};

    const title = formData.get("title");
    const isPrivate = formData.get("isPrivate") ? true : false;

    if (!title.length) {
        await createToastCookie("error", "Provide a title for your guide.");
        return;
    }

    try {
        // Verify google place id provided is valid
        const placeResult = await getPlaceData(gpId);

        newGuide = await GuideService.addGuide({
            authorId: userId,
            googlePlaceId: gpId,
            title,
            isPrivate,
            latitude: placeResult.location.latitude,
            longitude: placeResult.location.longitude,
        });

        await createToastCookie("success", "Successfully created guide.");
        created = true;
    } catch (err) {
        console.error(`Error in actions.handleGuideCreate: ${err.message}.`);
        await createToastCookie("error", err.message);
    }

    // once done, redirect to the new guide's page:
    if (created) redirect(`/guides/${newGuide.id}`);
}
