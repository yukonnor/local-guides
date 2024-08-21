"use server";
import GuidePlaceService from "@/services/GuidePlaceService";

// Handle submit from PlaceDeleteForm
export async function handleDeletePlace(placeId) {
    try {
        // Update place data
        const deletedPlace = await GuidePlaceService.deleteGuidePlace(placeId);

        return deletedPlace;
    } catch (err) {
        console.error(`Error in actions.handleDeletePlace: ${err.message}.`);
        throw err;
    }
}
