import GuideService from "@/services/GuideService";
import GuideDetails from "./_components/GuideDetails";
import { getSession } from "@/lib/sessionHandler";
import { getPlaceData } from "@/lib/api/googlePlaces";
import { redirect, notFound } from "next/navigation";
import { isPublicOrSharedWith } from "@/lib/authMiddleware";
import { isOwnerOrAdmin } from "@/lib/authMiddleware";
import PageContent from "@/components/PageContent";

export async function generateMetadata({ params }, parent) {
    const guideId = parseInt(params.id);
    let guide;

    // fetch data
    try {
        guide = await GuideService.getGuideById(guideId);
    } catch (err) {
        console.error("An error generating page title:", err);
        return {
            title: "Guide | Local Guide",
        };
    }

    return {
        title: `${guide.title} | Local Guides`,
    };
}

// get place data from the Google API
async function fetchPlaceDataFromGoogle(places) {
    if (places.length === 0) {
        return [];
    }

    try {
        // Fetch details for each place from Google API
        const detailedPlaces = await Promise.all(
            places.map(async (place) => {
                const placeData = await getPlaceData(place.googlePlaceId);
                return { ...place, ...placeData };
            })
        );
        return detailedPlaces;
    } catch (error) {
        console.error("Error fetching place details:", error);
        throw new Error("Error fetching place details."); // Throw user-facing error.
    }
}

export default async function GuidePage({ params }) {
    const session = await getSession();
    const guideId = parseInt(params.id);

    if (!guideId) notFound(); // throw 404 if a non-interger value provided in URL

    let guide;

    try {
        guide = await GuideService.getGuideById(params.id);
    } catch (err) {
        if (err.status === 404) {
            notFound(); // Show the 404 page
        } else {
            console.error("An error occurred:", err);
            throw new Error("Sorry, but we're unable to load this guide page."); // Throw user-facing error.
        }
    }

    // Auth: Ensure either public, owner or shared with
    const authorized = await isPublicOrSharedWith(session, guideId);
    if (!authorized) {
        redirect("/?alert=not-authorized-guide");
    }
    // End Auth

    const places = await fetchPlaceDataFromGoogle(guide.places);
    const showEditFeatures = await isOwnerOrAdmin(session, guide.id, "guide");

    return (
        <PageContent>
            <GuideDetails guide={guide} places={places} showEditFeatures={showEditFeatures} />
        </PageContent>
    );
}
