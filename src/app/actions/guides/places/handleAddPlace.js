"use server";
import { redirect } from "next/navigation";
import GuidePlaceService from "@/services/GuidePlaceService";
import { createToastCookie } from "@/app/actions/cookieActions";

// Handle submit from AddPlaceForm (AddPlaceCard)
export async function handleAddPlace(guideId, gpId, formData) {
    let added = false;
    const description = formData.get("description");
    const recType = formData.get("recType");

    try {
        const newPlace = await GuidePlaceService.addGuidePlace(guideId, {
            googlePlaceId: gpId,
            description,
            recType,
        });
        // await createToastCookie("success", "Successfully added place.");
        added = true;
    } catch (err) {
        console.error(`Error in actions.handleAddPlace: ${err.message}.`);
        await createToastCookie("error", err.message);
    }

    if (added) redirect(`/guides/${guideId}`);
}
