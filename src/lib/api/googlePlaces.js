import fetch from "node-fetch";
import { BadRequestError, AppError } from "@/utils/errors";
import {
    DEFAULT_RADIUS,
    PLACES_FIELDS,
    PLACE_FIELDS,
    LOCALITIES_FIELDS,
    LOCALITY_FIELDS,
} from "./constants";
import { exLocalityResults, exPlaceResults, exPlaceDetailsResults } from "./dummyGooglePlaceData";

const MAPS_API_KEY = process.env.MAPS_API_KEY;

export async function searchPlaces(textQuery, lat, long) {
    console.log("MAKING searchPlaces() CALL TO GOOGLE API!");
    const url = `https://places.googleapis.com/v1/places:searchText?fields=${PLACES_FIELDS}&key=${MAPS_API_KEY}`;
    const body = {
        textQuery: textQuery,
        locationBias: {
            circle: {
                center: {
                    latitude: lat,
                    longitude: long,
                },
                radius: DEFAULT_RADIUS,
            },
        },
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error(
                "Error searching places from Google Places API:",
                response.status,
                response.statusText,
                errorData,
                "Request made to:",
                url
            );
            throw new BadRequestError("Failed to fetch places from Google Places API");
        }
        const data = await response.json();
        return data.places;
        // return dummyPlaceResults;
    } catch (error) {
        console.error(error);
        throw new AppError(error.message);
    }
}

export async function searchLocalities(textQuery) {
    console.log("MAKING searchLocalities() CALL TO GOOGLE API!");
    const url = `https://places.googleapis.com/v1/places:searchText?fields=${LOCALITIES_FIELDS}&key=${MAPS_API_KEY}`;
    const body = {
        textQuery: textQuery,
        includedType: "locality",
        strictTypeFiltering: true,
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error(
                "Error fetching places from Google Places API:",
                response.status,
                response.statusText,
                errorData,
                "Request made to:",
                url
            );
            throw new Error("Failed to fetch places from Google Places API");
        }

        const data = await response.json();

        return data.places ?? [];
        // return dummyLocalityResults;
    } catch (error) {
        console.error(error);
        throw new AppError(error.message);
    }
}

/** getPlaceData(placeId, [type])
 *
 *  Gets details about a place or locality given the Google Place ID
 */

export async function getPlaceData(placeId, type = "place") {
    console.log("MAKING getPlaceData() CALL TO GOOGLE API!", placeId);
    const fields = type === "place" ? PLACE_FIELDS : LOCALITY_FIELDS;
    const url = `https://places.googleapis.com/v1/places/${placeId}?fields=${fields}&key=${MAPS_API_KEY}`;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error(
                "Error fetching place from Google Places API:",
                response.status,
                response.statusText,
                errorData,
                "Request made to:",
                url
            );

            // if an invalid place id was provided, return undefined so that the UI tell user without throwing error
            if (errorData.error.message.startsWith("Not a valid Place ID:")) return undefined;

            // Otherwise, throw error for unexpected issues.
            throw new Error(`Failed to fetch place from Google Places API: ${response.statusText}`);
        }
        const placeData = await response.json();
        // const placeData = dummyPlaceDetailsResults;
        return placeData;
    } catch (error) {
        console.error(error);
        throw new AppError(error.message);
    }
}
