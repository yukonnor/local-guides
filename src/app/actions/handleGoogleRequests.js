"use server";
import { searchPlaces, searchLocalities } from "@/lib/api/googlePlaces";

// Handle place search from the AddPlaceForm (returns results to form to set state)
export async function handleSearchPlace(searchQuery, lat, long) {
    try {
        const placeResults = await searchPlaces(searchQuery, lat, long);
        return placeResults;
    } catch (err) {
        console.error(`Error in actions.handleSearchPlace: ${err.message}.`);
        throw err;
    }
}

// Handle place search from the AddPlaceForm (returns results to form to set state)
export async function handleSearchLocality(searchQuery) {
    try {
        const localityResults = await searchLocalities(searchQuery);
        return localityResults;
    } catch (err) {
        console.error(`Error in actions.handleSearchLocality: ${err.message}.`);
        throw err;
    }
}
